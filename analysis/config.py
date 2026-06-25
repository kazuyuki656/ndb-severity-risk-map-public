"""NDB第10回オープンデータ 重症化予防ニーズマップ - 設定"""
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'DATA')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output')

REGION_FILES = {
    'HbA1c':        '001495682.xlsx',
    '空腹時血糖':    '001495747.xlsx',
    'eGFR':         '001495770.xlsx',
    '尿蛋白':       '001495755.xlsx',
    '収縮期血圧':    '001495751.xlsx',
    'LDL':          '001495691.xlsx',
    '心電図':       '001495772.xlsx',
    '中性脂肪':     '001495753.xlsx',
}

PREF_FILES = {
    'HbA1c':        '001495681.xlsx',
    '空腹時血糖':    '001495734.xlsx',
    'eGFR':         '001495768.xlsx',
    '尿蛋白':       '001495754.xlsx',
    '収縮期血圧':    '001495750.xlsx',
    'LDL':          '001495686.xlsx',
    '心電図':       '001495771.xlsx',
    '中性脂肪':     '001495752.xlsx',
}

MEAN_FILES = {
    'pref':   '001495696.xlsx',
    'region': '001495697.xlsx',
}

RISK_THRESHOLDS = {
    'HbA1c': {
        'domain': '糖尿病',
        'risk_categories': ['8.4以上', '8.0以上8.4未満', '6.5以上8.0未満'],
        'all_categories': ['8.4以上', '8.0以上8.4未満', '6.5以上8.0未満',
                           '6.0以上6.5未満', '5.6以上6.0未満', '5.6未満'],
    },
    '空腹時血糖': {
        'domain': '糖尿病',
        'risk_categories': ['126以上'],
        'all_categories': ['126以上', '110以上126未満', '100以上110未満', '100未満'],
    },
    'eGFR': {
        'domain': 'CKD',
        'risk_categories': ['45以上60未満', '30以上45未満', '30未満'],
        'all_categories': ['90以上', '60以上90未満', '45以上60未満', '30以上45未満', '30未満'],
    },
    '尿蛋白': {
        'domain': 'CKD',
        'risk_categories': ['＋', '＋＋', '＋＋＋'],
        'all_categories': ['－', '±', '＋', '＋＋', '＋＋＋'],
    },
    '収縮期血圧': {
        'domain': '心血管',
        'risk_categories': ['180以上', '160以上180未満', '140以上160未満'],
        'all_categories': ['180以上', '160以上180未満', '140以上160未満',
                           '130以上140未満', '120以上130未満', '120未満'],
    },
    'LDL': {
        'domain': '心血管',
        'risk_categories': ['180以上', '160以上180未満', '140以上160未満'],
        'all_categories': ['180以上', '160以上180未満', '140以上160未満',
                           '120以上140未満', '100以上120未満', '100未満'],
    },
    '心電図': {
        'domain': '心血管',
        'risk_categories': ['所見あり'],
        'all_categories': ['所見あり', '所見なし'],
    },
    '中性脂肪': {
        'domain': '心血管',
        'risk_categories': ['1000以上', '500以上1000未満', '300以上500未満', '150以上300未満'],
        'all_categories': ['1000以上', '500以上1000未満', '300以上500未満',
                           '150以上300未満', '150未満'],
    },
}

AGE_COLS_MALE = list(range(4, 12))    # cols 4-11: 男 40-44 ~ 70-74 + 中計
AGE_COLS_FEMALE = list(range(12, 20)) # cols 12-19: 女 40-44 ~ 70-74 + 中計
MALE_SUBTOTAL = 11
FEMALE_SUBTOTAL = 19
