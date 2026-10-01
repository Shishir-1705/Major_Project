"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 8.1: ML Dataset Inspection & Quality Check (With Spatial Metadata Audit)

PURPOSE:
1. Inspect the exported GEE feature table (data/Mysuru_Urban_Heat_Hotspot_Features_Step7.csv).
2. Perform comprehensive data quality checks including longitude and latitude spatial metadata.
3. Explicitly verify that longitude and latitude are marked as spatial metadata ONLY, NOT ML predictors.
4. Confirm zero missing/non-finite coordinates, target leakage prevention, and class balance.
"""

import os
import pandas as pd
import numpy as np

def inspect_dataset(csv_path):
    print("=====================================================")
    print("STEP 8.1: ML DATASET INSPECTION & QUALITY CHECK REPORT")
    print("=====================================================")
    
    # 1. File existence and size check
    if not os.path.exists(csv_path):
        print(f"FAIL: File not found at {csv_path}")
        return
        
    file_size_bytes = os.path.getsize(csv_path)
    file_size_kb = file_size_bytes / 1024.0
    print(f"File Location: {csv_path}")
    print(f"File Size: {file_size_bytes} bytes ({file_size_kb:.2f} KB)")
    print("-----------------------------------------------------")
    
    # Load dataset
    df = pd.read_csv(csv_path)
    
    # 2. Dimensions and Columns
    num_rows, num_cols = df.shape
    columns_list = list(df.columns)
    print(f"Total Number of Rows: {num_rows}")
    print(f"Total Number of Columns: {num_cols}")
    print(f"Exact Column Names & Order: {columns_list}")
    print("-----------------------------------------------------")
    
    # 3. Explicit Predictor vs Target vs Metadata Role Designation
    predictors = ['NDVI', 'NDBI']
    target = 'hotspot_label'
    metadata = ['longitude', 'latitude']
    
    print("VARIABLE ROLE SPECIFICATION AUDIT:")
    print(f"  - Predictors (X): {predictors}")
    print(f"  - Target Label (Y): {target}")
    print(f"  - Spatial Metadata: {metadata} (EXPLICITLY EXCLUDED FROM ML PREDICTORS)")
    print("-----------------------------------------------------")
    
    # 4. Data Types
    print("Data Types per Column:")
    for col, dtype in df.dtypes.items():
        print(f"  - {col}: {dtype}")
    print("-----------------------------------------------------")
    
    # 5. Missing / Null / NaN Check
    null_counts = df.isnull().sum()
    print("Missing / Null / NaN Value Counts:")
    for col, count in null_counts.items():
        print(f"  - {col}: {count}")
    print("-----------------------------------------------------")
    
    # 6. Infinite / Non-finite Values Check
    num_df = df.select_dtypes(include=[np.number])
    inf_counts = np.isinf(num_df).sum()
    print("Infinite / Non-finite Value Counts:")
    for col, count in inf_counts.items():
        print(f"  - {col}: {count}")
    print("-----------------------------------------------------")
    
    # 7. Predictor Statistics: NDVI
    if 'NDVI' in df.columns:
        print("NDVI Summary Statistics:")
        print(f"  - Minimum: {df['NDVI'].min():.6f}")
        print(f"  - Maximum: {df['NDVI'].max():.6f}")
        print(f"  - Mean:    {df['NDVI'].mean():.6f}")
        print(f"  - Std Dev: {df['NDVI'].std():.6f}")
    print("-----------------------------------------------------")
    
    # 8. Predictor Statistics: NDBI
    if 'NDBI' in df.columns:
        print("NDBI Summary Statistics:")
        print(f"  - Minimum: {df['NDBI'].min():.6f}")
        print(f"  - Maximum: {df['NDBI'].max():.6f}")
        print(f"  - Mean:    {df['NDBI'].mean():.6f}")
        print(f"  - Std Dev: {df['NDBI'].std():.6f}")
    print("-----------------------------------------------------")
    
    # 9. Spatial Metadata Statistics: Longitude & Latitude
    if 'longitude' in df.columns and 'latitude' in df.columns:
        print("Spatial Metadata Coordinates Range (Mysuru AOI):")
        print(f"  - Longitude Range: {df['longitude'].min():.6f}° E to {df['longitude'].max():.6f}° E")
        print(f"  - Latitude Range:  {df['latitude'].min():.6f}° N to {df['latitude'].max():.6f}° N")
        
        valid_lon = (df['longitude'] >= 76.55) & (df['longitude'] <= 76.78)
        valid_lat = (df['latitude'] >= 12.20) & (df['latitude'] <= 12.40)
        in_aoi = valid_lon.all() and valid_lat.all()
        print(f"  - Coordinates within Validated Mysuru AOI: {in_aoi}")
    else:
        print("Spatial Metadata: MISSING")
    print("-----------------------------------------------------")
    
    # 10. Target Label Diagnostics: hotspot_label
    if 'hotspot_label' in df.columns:
        unique_vals = sorted(df['hotspot_label'].unique())
        class_counts = df['hotspot_label'].value_counts().to_dict()
        c0_count = class_counts.get(0, 0)
        c1_count = class_counts.get(1, 0)
        c0_pct = (c0_count / num_rows * 100) if num_rows > 0 else 0
        c1_pct = (c1_count / num_rows * 100) if num_rows > 0 else 0
        
        print("hotspot_label Diagnostics:")
        print(f"  - Unique Values: {unique_vals}")
        print(f"  - Class 0 (Cooler Built-up) Count: {c0_count} ({c0_pct:.2f}%)")
        print(f"  - Class 1 (Thermal Hotspot) Count: {c1_count} ({c1_pct:.2f}%)")
        print(f"  - Binary Integrity Check (Only 0 & 1): {set(unique_vals).issubset({0, 1})}")
    else:
        print("hotspot_label: MISSING")
    print("-----------------------------------------------------")
    
    # 11. Target Leakage Prevention Audit
    forbidden_cols = ['LST_Celsius', 'LST', 'ST_B10']
    found_forbidden = [col for col in forbidden_cols if col in df.columns]
    print("Forbidden Thermal Column Check (Leakage Prevention):")
    print(f"  - Forbidden Columns Present: {found_forbidden}")
    print(f"  - Target Leakage Check Result: {'FAIL - Leakage Detected' if found_forbidden else 'PASS - No Leakage'}")
    print("-----------------------------------------------------")
    
    # 12. Display First 5 Rows
    print("First 5 Sample Rows:")
    print(df.head(5).to_string(index=False))
    print("=====================================================")

if __name__ == "__main__":
    csv_file = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Features_Step7.csv")
    inspect_dataset(csv_file)
