import pandas as pd, os
from pathlib import Path

d = Path(__file__).resolve().parent / 'output'

comp = pd.read_csv(os.path.join(d, 'composite_scores.csv'), encoding='utf-8-sig')

out = os.path.join(d, 'summary.txt')
with open(out, 'w', encoding='utf-8') as f:
    f.write("=== 重症化リスク上位30二次医療圏 ===\n")
    for _, row in comp.head(30).iterrows():
        f.write(f"{int(row['risk_rank']):3d}. {row['pref']} / {row['region_name']}"
                f"  総合={row['composite_score']:.1f}")
        for d_name in ['糖尿病', 'CKD', '心血管']:
            if d_name in row and pd.notna(row[d_name]):
                f.write(f"  {d_name}={row[d_name]:.1f}")
        f.write(f"  tier={row['risk_tier']}\n")

    f.write(f"\n=== 重症化リスク下位10二次医療圏 ===\n")
    for _, row in comp.tail(10).iterrows():
        f.write(f"{int(row['risk_rank']):3d}. {row['pref']} / {row['region_name']}"
                f"  総合={row['composite_score']:.1f}")
        for d_name in ['糖尿病', 'CKD', '心血管']:
            if d_name in row and pd.notna(row[d_name]):
                f.write(f"  {d_name}={row[d_name]:.1f}")
        f.write(f"  tier={row['risk_tier']}\n")

    f.write(f"\n=== ドメイン別統計 ===\n")
    for d_name in ['糖尿病', 'CKD', '心血管', 'composite_score']:
        if d_name in comp.columns:
            s = comp[d_name].describe()
            f.write(f"\n{d_name}:\n")
            for k, v in s.items():
                f.write(f"  {k}: {v:.2f}\n")

    f.write(f"\n=== リスクティア分布 ===\n")
    tier_counts = comp['risk_tier'].value_counts()
    for tier, cnt in tier_counts.items():
        f.write(f"  {tier}: {cnt}圏域\n")

    # prefecture-level aggregation
    f.write(f"\n=== 都道府県別 平均複合スコア（上位15） ===\n")
    pref_avg = comp.groupby('pref')['composite_score'].mean().sort_values(ascending=False)
    for pref, score in pref_avg.head(15).items():
        n_regions = len(comp[comp['pref'] == pref])
        f.write(f"  {pref}: {score:.1f} ({n_regions}圏域)\n")
