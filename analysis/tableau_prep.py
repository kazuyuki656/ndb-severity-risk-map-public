"""Tableau/Superset向けデータ加工"""
import os
import pandas as pd
from config import OUTPUT_DIR

PREF_META = {
    '北海道': {'code': '01', 'en': 'Hokkaido', 'topo_id': 'JP.HK', 'region': '北海道'},
    '青森県': {'code': '02', 'en': 'Aomori', 'topo_id': 'JP.AO', 'region': '東北'},
    '岩手県': {'code': '03', 'en': 'Iwate', 'topo_id': 'JP.IW', 'region': '東北'},
    '宮城県': {'code': '04', 'en': 'Miyagi', 'topo_id': 'JP.MG', 'region': '東北'},
    '秋田県': {'code': '05', 'en': 'Akita', 'topo_id': 'JP.AK', 'region': '東北'},
    '山形県': {'code': '06', 'en': 'Yamagata', 'topo_id': 'JP.YT', 'region': '東北'},
    '福島県': {'code': '07', 'en': 'Fukushima', 'topo_id': 'JP.FS', 'region': '東北'},
    '茨城県': {'code': '08', 'en': 'Ibaraki', 'topo_id': 'JP.IB', 'region': '関東'},
    '栃木県': {'code': '09', 'en': 'Tochigi', 'topo_id': 'JP.TC', 'region': '関東'},
    '群馬県': {'code': '10', 'en': 'Gunma', 'topo_id': 'JP.GM', 'region': '関東'},
    '埼玉県': {'code': '11', 'en': 'Saitama', 'topo_id': 'JP.ST', 'region': '関東'},
    '千葉県': {'code': '12', 'en': 'Chiba', 'topo_id': 'JP.CH', 'region': '関東'},
    '東京都': {'code': '13', 'en': 'Tokyo', 'topo_id': 'JP.TK', 'region': '関東'},
    '神奈川県': {'code': '14', 'en': 'Kanagawa', 'topo_id': 'JP.KN', 'region': '関東'},
    '新潟県': {'code': '15', 'en': 'Niigata', 'topo_id': 'JP.NI', 'region': '中部'},
    '富山県': {'code': '16', 'en': 'Toyama', 'topo_id': 'JP.TY', 'region': '中部'},
    '石川県': {'code': '17', 'en': 'Ishikawa', 'topo_id': 'JP.IS', 'region': '中部'},
    '福井県': {'code': '18', 'en': 'Fukui', 'topo_id': 'JP.FI', 'region': '中部'},
    '山梨県': {'code': '19', 'en': 'Yamanashi', 'topo_id': 'JP.YN', 'region': '中部'},
    '長野県': {'code': '20', 'en': 'Nagano', 'topo_id': 'JP.NN', 'region': '中部'},
    '岐阜県': {'code': '21', 'en': 'Gifu', 'topo_id': 'JP.GF', 'region': '中部'},
    '静岡県': {'code': '22', 'en': 'Shizuoka', 'topo_id': 'JP.SZ', 'region': '中部'},
    '愛知県': {'code': '23', 'en': 'Aichi', 'topo_id': 'JP.AI', 'region': '中部'},
    '三重県': {'code': '24', 'en': 'Mie', 'topo_id': 'JP.ME', 'region': '近畿'},
    '滋賀県': {'code': '25', 'en': 'Shiga', 'topo_id': 'JP.SH', 'region': '近畿'},
    '京都府': {'code': '26', 'en': 'Kyoto', 'topo_id': 'JP.KY', 'region': '近畿'},
    '大阪府': {'code': '27', 'en': 'Osaka', 'topo_id': 'JP.OS', 'region': '近畿'},
    '兵庫県': {'code': '28', 'en': 'Hyogo', 'topo_id': 'JP.HG', 'region': '近畿'},
    '奈良県': {'code': '29', 'en': 'Nara', 'topo_id': 'JP.NR', 'region': '近畿'},
    '和歌山県': {'code': '30', 'en': 'Wakayama', 'topo_id': 'JP.WK', 'region': '近畿'},
    '鳥取県': {'code': '31', 'en': 'Tottori', 'topo_id': 'JP.TT', 'region': '中国'},
    '島根県': {'code': '32', 'en': 'Shimane', 'topo_id': 'JP.SM', 'region': '中国'},
    '岡山県': {'code': '33', 'en': 'Okayama', 'topo_id': 'JP.OY', 'region': '中国'},
    '広島県': {'code': '34', 'en': 'Hiroshima', 'topo_id': 'JP.HS', 'region': '中国'},
    '山口県': {'code': '35', 'en': 'Yamaguchi', 'topo_id': 'JP.YC', 'region': '中国'},
    '徳島県': {'code': '36', 'en': 'Tokushima', 'topo_id': 'JP.TS', 'region': '四国'},
    '香川県': {'code': '37', 'en': 'Kagawa', 'topo_id': 'JP.KG', 'region': '四国'},
    '愛媛県': {'code': '38', 'en': 'Ehime', 'topo_id': 'JP.EH', 'region': '四国'},
    '高知県': {'code': '39', 'en': 'Kochi', 'topo_id': 'JP.KC', 'region': '四国'},
    '福岡県': {'code': '40', 'en': 'Fukuoka', 'topo_id': 'JP.FO', 'region': '九州'},
    '佐賀県': {'code': '41', 'en': 'Saga', 'topo_id': 'JP.SG', 'region': '九州'},
    '長崎県': {'code': '42', 'en': 'Nagasaki', 'topo_id': 'JP.NS', 'region': '九州'},
    '熊本県': {'code': '43', 'en': 'Kumamoto', 'topo_id': 'JP.KM', 'region': '九州'},
    '大分県': {'code': '44', 'en': 'Oita', 'topo_id': 'JP.OT', 'region': '九州'},
    '宮崎県': {'code': '45', 'en': 'Miyazaki', 'topo_id': 'JP.MZ', 'region': '九州'},
    '鹿児島県': {'code': '46', 'en': 'Kagoshima', 'topo_id': 'JP.KS', 'region': '九州'},
    '沖縄県': {'code': '47', 'en': 'Okinawa', 'topo_id': 'JP.ON', 'region': '九州'},
}


def add_pref_metadata(df: pd.DataFrame) -> pd.DataFrame:
    """都道府県メタデータ（JISコード・英名・地方区分）を付与。"""
    meta_df = pd.DataFrame.from_dict(PREF_META, orient='index')
    meta_df.index.name = 'pref'
    meta_df = meta_df.reset_index()
    meta_df.columns = ['pref', 'pref_code', 'pref_en', 'topo_id', 'area']
    return df.merge(meta_df, on='pref', how='left')


def create_tableau_datasets():
    """Tableau接続用の加工済みデータセットを出力。"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # 1. 二次医療圏別 指標別tidy（Tableauメインデータソース）
    risk = pd.read_csv(
        os.path.join(OUTPUT_DIR, 'region_risk_rates.csv'), encoding='utf-8-sig'
    )
    risk = add_pref_metadata(risk)
    risk['risk_rate_pct'] = (risk['risk_rate'] * 100).round(2)
    risk['risk_rate_male_pct'] = (risk['risk_rate_male'] * 100).round(2)
    risk['risk_rate_female_pct'] = (risk['risk_rate_female'] * 100).round(2)

    col_order = [
        'pref_code', 'pref', 'pref_en', 'area', 'topo_id',
        'region_code', 'region_name',
        'domain', 'indicator',
        'n_total', 'n_risk', 'risk_rate', 'risk_rate_pct',
        'n_male', 'n_risk_male', 'risk_rate_male', 'risk_rate_male_pct',
        'n_female', 'n_risk_female', 'risk_rate_female', 'risk_rate_female_pct',
    ]
    risk = risk[col_order].sort_values(['pref_code', 'region_code', 'domain', 'indicator'])

    path1 = os.path.join(OUTPUT_DIR, 'tableau_region_indicators.csv')
    risk.to_csv(path1, index=False, encoding='utf-8-sig')
    print(f"[1] {path1} ({len(risk)} rows)")

    # 2. 二次医療圏別 複合スコア（Tableauスコアカード用）
    comp = pd.read_csv(
        os.path.join(OUTPUT_DIR, 'composite_scores.csv'), encoding='utf-8-sig'
    )
    comp = add_pref_metadata(comp)
    comp = comp.sort_values('risk_rank')

    path2 = os.path.join(OUTPUT_DIR, 'tableau_composite_scores.csv')
    comp.to_csv(path2, index=False, encoding='utf-8-sig')
    print(f"[2] {path2} ({len(comp)} rows)")

    # 3. 都道府県別 集約スコア（コロプレスマップ用）
    pref_agg = comp.groupby(['pref_code', 'pref', 'pref_en', 'topo_id', 'area']).agg(
        composite_mean=('composite_score', 'mean'),
        composite_max=('composite_score', 'max'),
        composite_min=('composite_score', 'min'),
        n_regions=('region_code', 'count'),
        n_high_risk=('risk_tier', lambda x: (x == '高リスク').sum()),
    ).reset_index()

    for d in ['糖尿病', 'CKD', '心血管']:
        if d in comp.columns:
            d_agg = comp.groupby('pref')[d].mean().reset_index()
            d_agg.columns = ['pref', f'{d}_mean']
            pref_agg = pref_agg.merge(d_agg, on='pref', how='left')

    pref_agg = pref_agg.sort_values('composite_mean', ascending=False)
    pref_agg['pref_rank'] = range(1, len(pref_agg) + 1)

    path3 = os.path.join(OUTPUT_DIR, 'tableau_pref_summary.csv')
    pref_agg.to_csv(path3, index=False, encoding='utf-8-sig')
    print(f"[3] {path3} ({len(pref_agg)} rows)")

    # 4. コロプレスマップ用JSON（D3/Web用）
    import json
    map_data = {}
    for _, row in pref_agg.iterrows():
        map_data[row['topo_id']] = {
            'pref': row['pref'],
            'score': round(row['composite_mean'], 1),
            'rank': int(row['pref_rank']),
            'n_regions': int(row['n_regions']),
            'n_high_risk': int(row['n_high_risk']),
            'dm': round(row.get('糖尿病_mean', 50), 1),
            'ckd': round(row.get('CKD_mean', 50), 1),
            'cv': round(row.get('心血管_mean', 50), 1),
        }

    path4 = os.path.join(OUTPUT_DIR, 'choropleth_data.json')
    with open(path4, 'w', encoding='utf-8') as f:
        json.dump(map_data, f, ensure_ascii=False, indent=2)
    print(f"[4] {path4} ({len(map_data)} prefectures)")

    return pref_agg


if __name__ == '__main__':
    create_tableau_datasets()
