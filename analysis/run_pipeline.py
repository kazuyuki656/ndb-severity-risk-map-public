"""パイプライン一括実行"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from etl import run_etl
from score import run_scoring

print("=" * 60)
print("STEP 1: ETL - NDBオープンデータ → tidy CSV")
print("=" * 60)
combined = run_etl()

print("\n" + "=" * 60)
print("STEP 2: SCORING - 重症化リスク複合スコア算出")
print("=" * 60)
composite = run_scoring()

print("\n" + "=" * 60)
print("DONE - 出力ファイル一覧")
print("=" * 60)
output_dir = os.path.join(os.path.dirname(__file__), 'output')
for f in sorted(os.listdir(output_dir)):
    fpath = os.path.join(output_dir, f)
    size_kb = os.path.getsize(fpath) / 1024
    print(f"  {f} ({size_kb:.0f} KB)")
