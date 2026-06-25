"""日本地図コロプレスマップの画像化（matplotlib・TopoJSON手動デコード）

geopandas不要。datamaps の jpn.topo.json を自前でデコードし、
都道府県別 複合スコア（粗版・年齢調整版）を塗り分けたPNGを生成する。
"""
import os
import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from matplotlib.patches import Polygon as MplPolygon
from matplotlib.collections import PatchCollection
from matplotlib.colors import LinearSegmentedColormap, Normalize
from matplotlib.cm import ScalarMappable

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, 'output')
TOPO = os.path.join(HERE, 'geo', 'jpn.topo.json')

for jf in ['Yu Gothic', 'Meiryo', 'MS Gothic']:
    if jf in set(f.name for f in fm.fontManager.ttflist):
        plt.rcParams['font.family'] = jf
        break
plt.rcParams['axes.unicode_minus'] = False

# topo_id → 都道府県名（tableau_prep.PREF_META と整合）
from tableau_prep import PREF_META
ID2PREF = {v['topo_id']: k for k, v in PREF_META.items()}


# ---------- TopoJSON デコード ----------
def load_topology():
    with open(TOPO, encoding='utf-8') as f:
        topo = json.load(f)
    scale = topo['transform']['scale']
    translate = topo['transform']['translate']
    # アークを絶対座標へ（デルタ復号 + 変換）
    arcs = []
    for arc in topo['arcs']:
        x = y = 0
        pts = []
        for dx, dy in arc:
            x += dx
            y += dy
            pts.append((x * scale[0] + translate[0], y * scale[1] + translate[1]))
        arcs.append(pts)
    return topo, arcs


def arc_coords(arcs, idx):
    """アーク参照（負値は逆順）から座標列を返す。"""
    if idx >= 0:
        return arcs[idx]
    return arcs[-1 - idx][::-1]


def ring_coords(arcs, ring):
    """リング（アークidxの列）を連結した座標列。"""
    coords = []
    for i in ring:
        seg = arc_coords(arcs, i)
        if coords:
            coords.extend(seg[1:])  # 連結点の重複を除去
        else:
            coords.extend(seg)
    return coords


def geometry_polygons(arcs, geom):
    """geometry → [外周リング座標, ...]（穴は簡略化のため外周のみ使用）。"""
    polys = []
    if geom['type'] == 'Polygon':
        for ring in geom['arcs']:
            polys.append(ring_coords(arcs, ring))
    elif geom['type'] == 'MultiPolygon':
        for poly in geom['arcs']:
            for ring in poly:  # 各ポリゴンの最初=外周。穴も描くが塗りは外周優先
                polys.append(ring_coords(arcs, ring))
    return polys


# ---------- 都道府県別スコアの集約 ----------
def pref_scores():
    crude = pd.read_csv(os.path.join(OUT, 'composite_scores.csv'), encoding='utf-8-sig')
    adj = pd.read_csv(os.path.join(OUT, 'composite_scores_adjusted.csv'), encoding='utf-8-sig')
    crude_p = crude.groupby('pref')['composite_score'].mean()
    adj_p = adj.groupby('pref')['composite_score'].mean()
    return crude_p.to_dict(), adj_p.to_dict()


# ---------- 描画 ----------
def draw_map(ax, topo, arcs, value_by_pref, title, vmin, vmax):
    cmap = LinearSegmentedColormap.from_list(
        'risk', ['#85B7EB', '#F2EFE6', '#E24B4A'])  # 低=青, 中=生成, 高=赤
    norm = Normalize(vmin=vmin, vmax=vmax)

    patches, colors, edge = [], [], []
    for geom in topo['objects']['jpn']['geometries']:
        tid = geom.get('id')
        pref = ID2PREF.get(tid)
        val = value_by_pref.get(pref) if pref else None
        for ring in geometry_polygons(arcs, geom):
            if len(ring) < 3:
                continue
            poly = MplPolygon(ring, closed=True)
            patches.append(poly)
            colors.append(cmap(norm(val)) if val is not None else (0.9, 0.9, 0.9, 1))

    pc = PatchCollection(patches, match_original=False)
    pc.set_facecolor(colors)
    pc.set_edgecolor('white')
    pc.set_linewidth(0.4)
    ax.add_collection(pc)

    ax.set_xlim(127, 146.5)   # 沖縄〜本州（沖縄は別枠で拡大しないが範囲に含める）
    ax.set_ylim(24, 46)
    ax.set_aspect(1.3)
    ax.axis('off')
    ax.set_title(title, fontsize=14, pad=8, weight='bold')

    sm = ScalarMappable(cmap=cmap, norm=norm)
    sm.set_array([])
    cb = plt.colorbar(sm, ax=ax, fraction=0.035, pad=0.02, shrink=0.7)
    cb.set_label('複合スコア（偏差値・全国平均50）', fontsize=9)
    cb.ax.tick_params(labelsize=8)


def main():
    topo, arcs = load_topology()
    crude_p, adj_p = pref_scores()

    allvals = list(crude_p.values()) + list(adj_p.values())
    vmin, vmax = min(allvals), max(allvals)

    # --- 1) 粗 vs 調整 並置 ---
    fig, axes = plt.subplots(1, 2, figsize=(13, 6.5))
    draw_map(axes[0], topo, arcs, crude_p, '粗スコア（年齢調整なし）', vmin, vmax)
    draw_map(axes[1], topo, arcs, adj_p, '年齢・性別調整スコア', vmin, vmax)
    fig.suptitle('都道府県別 重症化リスク複合スコア：年齢調整の効果', fontsize=16, weight='bold', y=0.98)
    plt.tight_layout(rect=[0, 0, 1, 0.96])
    p1 = os.path.join(OUT, 'fig4_choropleth_compare.png')
    fig.savefig(p1, dpi=150, bbox_inches='tight')
    print('Saved', p1)

    # --- 2) 年齢調整版 単独（レポート埋め込み用・大きめ） ---
    fig2, ax2 = plt.subplots(figsize=(8, 8.5))
    draw_map(ax2, topo, arcs, adj_p, '都道府県別 重症化リスク（年齢・性別調整済）', vmin, vmax)
    plt.tight_layout()
    p2 = os.path.join(OUT, 'fig5_choropleth_adjusted.png')
    fig2.savefig(p2, dpi=150, bbox_inches='tight')
    print('Saved', p2)


if __name__ == '__main__':
    main()
