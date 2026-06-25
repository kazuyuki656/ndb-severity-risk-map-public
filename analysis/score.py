"""重症化リスク複合スコアの算出"""
import os
import pandas as pd
import numpy as np
from config import OUTPUT_DIR, RISK_THRESHOLDS


def load_risk_data() -> pd.DataFrame:
    path = os.path.join(OUTPUT_DIR, 'region_risk_rates.csv')
    return pd.read_csv(path, encoding='utf-8-sig')


def compute_domain_scores(df: pd.DataFrame) -> pd.DataFrame:
    """各ドメイン（糖尿病・CKD・心血管）の複合スコアを算出。
    各指標のrisk_rateを全国偏差値（平均50, SD10）に変換し、ドメイン内平均をとる。
    """
    scored = df.copy()

    scored['z_score'] = scored.groupby('indicator')['risk_rate'].transform(
        lambda x: (x - x.mean()) / x.std()
    )
    scored['deviation_value'] = scored['z_score'] * 10 + 50

    domain_scores = scored.groupby(
        ['pref', 'region_code', 'region_name', 'domain']
    ).agg(
        domain_score=('deviation_value', 'mean'),
        n_indicators=('indicator', 'count'),
        indicators=('indicator', lambda x: ', '.join(sorted(x))),
    ).reset_index()

    return scored, domain_scores


def compute_composite_score(domain_scores: pd.DataFrame) -> pd.DataFrame:
    """3ドメインの平均から総合重症化リスクスコアを算出。"""
    composite = domain_scores.pivot_table(
        index=['pref', 'region_code', 'region_name'],
        columns='domain',
        values='domain_score',
    ).reset_index()

    composite.columns.name = None

    domains = ['糖尿病', 'CKD', '心血管']
    existing_domains = [d for d in domains if d in composite.columns]

    composite['composite_score'] = composite[existing_domains].mean(axis=1)

    composite['risk_rank'] = composite['composite_score'].rank(
        ascending=False, method='min'
    ).astype(int)

    composite['risk_tier'] = pd.qcut(
        composite['composite_score'],
        q=5,
        labels=['低リスク', 'やや低', '中程度', 'やや高', '高リスク'],
    )

    composite = composite.sort_values('composite_score', ascending=False)

    return composite


def run_scoring():
    df = load_risk_data()
    print(f"Loaded {len(df)} rows")

    scored, domain_scores = compute_domain_scores(df)

    scored_path = os.path.join(OUTPUT_DIR, 'region_scored.csv')
    scored.to_csv(scored_path, index=False, encoding='utf-8-sig')
    print(f"Saved scored data: {scored_path}")

    domain_path = os.path.join(OUTPUT_DIR, 'domain_scores.csv')
    domain_scores.to_csv(domain_path, index=False, encoding='utf-8-sig')
    print(f"Saved domain scores: {domain_path}")

    composite = compute_composite_score(domain_scores)

    composite_path = os.path.join(OUTPUT_DIR, 'composite_scores.csv')
    composite.to_csv(composite_path, index=False, encoding='utf-8-sig')
    print(f"Saved composite scores: {composite_path}")

    print(f"\n=== 重症化リスク上位20二次医療圏 ===")
    top20 = composite.head(20)
    for _, row in top20.iterrows():
        print(f"  {row['risk_rank']:3d}. {row['pref']} {row['region_name']}"
              f"  総合={row['composite_score']:.1f}"
              f"  糖尿病={row.get('糖尿病', 'N/A'):.1f}" if pd.notna(row.get('糖尿病')) else '',
              end='')
        print(f"  CKD={row.get('CKD', 'N/A'):.1f}" if pd.notna(row.get('CKD')) else '',
              end='')
        print(f"  心血管={row.get('心血管', 'N/A'):.1f}" if pd.notna(row.get('心血管')) else '')

    print(f"\n=== 重症化リスク下位10二次医療圏 ===")
    bottom10 = composite.tail(10)
    for _, row in bottom10.iterrows():
        print(f"  {row['risk_rank']:3d}. {row['pref']} {row['region_name']}"
              f"  総合={row['composite_score']:.1f}")

    return composite


if __name__ == '__main__':
    run_scoring()
