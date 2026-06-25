import pandas as pd, numpy as np, os
from pathlib import Path

d = Path(__file__).resolve().parent / 'output'
comp = pd.read_csv(os.path.join(d, 'composite_scores.csv'), encoding='utf-8-sig')
risk = pd.read_csv(os.path.join(d, 'region_risk_rates.csv'), encoding='utf-8-sig')
pref = pd.read_csv(os.path.join(d, 'tableau_pref_summary.csv'), encoding='utf-8-sig')

out = os.path.join(d, 'report_stats.txt')
with open(out, 'w', encoding='utf-8') as f:
    f.write("=== ドメイン間相関（圏域単位 n=335）===\n")
    domcols = ['糖尿病','CKD','心血管']
    corr = comp[domcols].corr()
    f.write(corr.round(3).to_string() + "\n\n")

    f.write("=== 複合スコア記述統計 ===\n")
    f.write(comp['composite_score'].describe().round(2).to_string() + "\n")
    f.write(f"変動係数CV: {comp['composite_score'].std()/comp['composite_score'].mean()*100:.1f}%\n\n")

    f.write("=== 各指標の全国リスク該当率（圏域平均）===\n")
    ind_mean = risk.groupby('indicator').agg(
        rate_mean=('risk_rate','mean'),
        rate_std=('risk_rate','std'),
        rate_min=('risk_rate','min'),
        rate_max=('risk_rate','max'),
        n_total=('n_total','sum'),
    )
    for ind, row in ind_mean.iterrows():
        f.write(f"{ind}: 平均{row['rate_mean']*100:.1f}% (SD{row['rate_std']*100:.1f}, "
                f"範囲{row['rate_min']*100:.1f}-{row['rate_max']*100:.1f}%) N={int(row['n_total']):,}\n")
    f.write("\n")

    f.write("=== ドメイン別スコアのばらつき（地域差の大きさ）===\n")
    for dc in domcols:
        f.write(f"{dc}: SD={comp[dc].std():.2f}, 範囲={comp[dc].min():.1f}-{comp[dc].max():.1f}\n")
    f.write("\n")

    f.write("=== 地方区分別 平均複合スコア ===\n")
    area = pref.groupby('area').agg(
        score=('composite_mean','mean'),
        n_pref=('pref','count'),
    ).sort_values('score', ascending=False)
    for a, row in area.iterrows():
        f.write(f"{a}: {row['score']:.1f} ({int(row['n_pref'])}県)\n")
    f.write("\n")

    f.write("=== 男女別リスク該当率（主要指標）===\n")
    for ind in ['HbA1c','eGFR','収縮期血圧','LDL']:
        sub = risk[risk['indicator']==ind]
        m = (sub['n_risk_male'].sum()/sub['n_male'].sum())*100
        fem = (sub['n_risk_female'].sum()/sub['n_female'].sum())*100
        f.write(f"{ind}: 男性{m:.1f}% / 女性{fem:.1f}%\n")
    f.write("\n")

    f.write("=== 総対象者数 ===\n")
    hba1c = risk[risk['indicator']=='HbA1c']
    f.write(f"HbA1c受診者総数: {hba1c['n_total'].sum():,}人\n")
    f.write(f"二次医療圏数: {comp['region_code'].nunique()}\n")

    # top/bottom CKD specifically
    f.write("\n=== CKDスコア上位5圏域 ===\n")
    for _, r in comp.nlargest(5,'CKD').iterrows():
        f.write(f"{r['pref']}/{r['region_name']}: CKD={r['CKD']:.1f}\n")

    f.write("\n=== 糖尿病スコア上位5圏域 ===\n")
    for _, r in comp.nlargest(5,'糖尿病').iterrows():
        f.write(f"{r['pref']}/{r['region_name']}: 糖尿病={r['糖尿病']:.1f}\n")
