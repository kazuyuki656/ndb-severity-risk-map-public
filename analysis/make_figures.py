import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import pandas as pd, numpy as np, os
from pathlib import Path

# 日本語フォント検索
jp_fonts = ['Yu Gothic', 'Meiryo', 'MS Gothic', 'Noto Sans CJK JP']
available = set(f.name for f in fm.fontManager.ttflist)
for jf in jp_fonts:
    if jf in available:
        plt.rcParams['font.family'] = jf
        print(f"Using font: {jf}")
        break
plt.rcParams['axes.unicode_minus'] = False

d = Path(__file__).resolve().parent / 'output'
comp = pd.read_csv(os.path.join(d, 'composite_scores.csv'), encoding='utf-8-sig')

# Figure 1: 上位15県 ドメイン別スコア
top15 = ['沖縄県','高知県','鹿児島県','青森県','徳島県','石川県','北海道','熊本県',
         '愛媛県','和歌山県','群馬県','岩手県','茨城県','富山県','三重県']
dm=[60.5,59.3,62.8,59.6,49.6,52.8,57.5,61.2,48.5,51.5,51.3,55.8,56.4,49.8,52.4]
ckd=[60.9,57.6,57.9,53.6,62.0,56.4,49.8,48.9,54.9,54.0,56.9,46.4,45.6,53.9,49.5]
cv=[55.9,54.6,49.1,51.2,50.9,50.8,51.9,48.3,54.8,52.6,49.7,55.2,52.8,50.7,52.4]

fig, ax = plt.subplots(figsize=(9, 6))
y = np.arange(len(top15))
h = 0.26
ax.barh(y+h, dm, h, label='糖尿病', color='#7F77DD')
ax.barh(y, ckd, h, label='CKD', color='#1D9E75')
ax.barh(y-h, cv, h, label='心血管', color='#D85A30')
ax.axvline(50, color='gray', linestyle='--', linewidth=1, alpha=0.7)
ax.text(50.3, len(top15)-0.3, '全国平均', color='gray', fontsize=9)
ax.set_yticks(y)
ax.set_yticklabels([p.replace('県','').replace('府','').replace('道','').replace('都','') for p in top15])
ax.invert_yaxis()
ax.set_xlim(35, 70)
ax.set_xlabel('偏差値スコア（全国平均=50）')
ax.set_title('都道府県別 3ドメイン重症化リスクスコア（複合スコア上位15県）', fontsize=12, pad=12)
ax.legend(loc='lower right', framealpha=0.9)
ax.grid(axis='x', alpha=0.2)
plt.tight_layout()
fig.savefig(os.path.join(d, 'fig1_domain_bars.png'), dpi=150, bbox_inches='tight')
print("Saved fig1")

# Figure 2: 指標別 全国リスク該当率
inds = ['心電図異常','LDL高値','収縮期血圧高値','中性脂肪高値','eGFR低下',
        'HbA1c高値','空腹時血糖高値','尿蛋白陽性']
rates = [30.6, 27.7, 20.6, 17.0, 11.2, 8.0, 6.4, 3.4]
stds = [12.8, 1.8, 3.4, 1.6, 2.9, 1.2, 1.0, 0.8]
domains_c = ['#D85A30','#D85A30','#D85A30','#D85A30','#1D9E75','#7F77DD','#7F77DD','#1D9E75']

fig2, ax2 = plt.subplots(figsize=(9, 5))
yy = np.arange(len(inds))
ax2.barh(yy, rates, xerr=stds, color=domains_c, alpha=0.85, capsize=3,
         error_kw={'elinewidth':1,'alpha':0.5})
ax2.set_yticks(yy)
ax2.set_yticklabels(inds)
ax2.invert_yaxis()
ax2.set_xlabel('リスク該当率（%）　エラーバー=圏域間SD')
ax2.set_title('検査項目別 全国リスク該当率（335二次医療圏の平均）', fontsize=12, pad=12)
ax2.grid(axis='x', alpha=0.2)
for i,(r,s) in enumerate(zip(rates,stds)):
    ax2.text(r+s+0.5, i, f'{r}%', va='center', fontsize=9)
plt.tight_layout()
fig2.savefig(os.path.join(d, 'fig2_indicator_rates.png'), dpi=150, bbox_inches='tight')
print("Saved fig2")

# Figure 3: ドメイン間散布図（糖尿病 vs CKD、独立性の可視化）
fig3, axes = plt.subplots(1, 2, figsize=(11, 4.8))
axes[0].scatter(comp['糖尿病'], comp['CKD'], s=18, alpha=0.5, color='#534AB7', edgecolors='none')
axes[0].axhline(50, color='gray', ls=':', lw=0.8); axes[0].axvline(50, color='gray', ls=':', lw=0.8)
axes[0].set_xlabel('糖尿病スコア'); axes[0].set_ylabel('CKDスコア')
axes[0].set_title('糖尿病 × CKD（r=0.10）', fontsize=11)
axes[0].grid(alpha=0.15)

axes[1].scatter(comp['糖尿病'], comp['心血管'], s=18, alpha=0.5, color='#D85A30', edgecolors='none')
axes[1].axhline(50, color='gray', ls=':', lw=0.8); axes[1].axvline(50, color='gray', ls=':', lw=0.8)
axes[1].set_xlabel('糖尿病スコア'); axes[1].set_ylabel('心血管スコア')
axes[1].set_title('糖尿病 × 心血管（r=0.39）', fontsize=11)
axes[1].grid(alpha=0.15)
fig3.suptitle('ドメイン間スコアの関係（各点=二次医療圏 n=335）', fontsize=12)
plt.tight_layout()
fig3.savefig(os.path.join(d, 'fig3_domain_scatter.png'), dpi=150, bbox_inches='tight')
print("Saved fig3")
