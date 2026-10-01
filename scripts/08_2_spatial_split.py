"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 8.2: Spatially Aware Train/Test Split (0.02° x 0.02° Spatial Blocking)

PURPOSE:
1. Implement a spatial blocking train/test split on data/Mysuru_Urban_Heat_Hotspot_Features_Step7.csv.
2. Group 30m samples into 0.02° x 0.02° (~2.2 km x 2.2 km) spatial grid blocks.
3. Assign whole spatial blocks deterministically (seed 42) to Train (~80%) and Test (~20%) partitions.
4. Ensure 0 shared spatial blocks between train and test to reduce spatial leakage risk.
5. Verify Class 0 and Class 1 representation in both train and test partitions.
6. Export train, test, and block assignment tables without modifying predictor values.
"""

import os
import numpy as np
import pandas as pd

def perform_spatial_split():
    print("=====================================================")
    print("STEP 8.2: SPATIALLY AWARE TRAIN/TEST SPLIT REPORT")
    print("=====================================================")
    
    input_csv = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Features_Step7.csv")
    if not os.path.exists(input_csv):
        print(f"FAIL: Input dataset not found at {input_csv}")
        return
        
    df = pd.read_csv(input_csv)
    total_samples = len(df)
    print(f"Input Dataset: {input_csv}")
    print(f"Total Input Samples: {total_samples}")
    print("-----------------------------------------------------")
    
    # 1. Spatial Block Construction (0.02° x 0.02° grid ~ 2.2 km x 2.2 km)
    block_size = 0.02
    df['lon_block_idx'] = np.floor(df['longitude'] / block_size).astype(int)
    df['lat_block_idx'] = np.floor(df['latitude'] / block_size).astype(int)
    df['spatial_block'] = "B_" + df['lon_block_idx'].astype(str) + "_" + df['lat_block_idx'].astype(str)
    
    unique_blocks = df['spatial_block'].unique()
    total_blocks = len(unique_blocks)
    print(f"Spatial Block Size: {block_size}° x {block_size}° (~2.2 km x 2.2 km)")
    print(f"Total Unique Spatial Blocks Identified: {total_blocks}")
    print("-----------------------------------------------------")
    
    # 2. Block Summary & Deterministic Assignment (Seed 42)
    block_stats = df.groupby('spatial_block').agg(
        sample_count=('hotspot_label', 'count'),
        c0_count=('hotspot_label', lambda x: (x == 0).sum()),
        c1_count=('hotspot_label', lambda x: (x == 1).sum())
    ).reset_index()
    
    # Deterministic shuffle of blocks
    np.random.seed(42)
    shuffled_blocks = block_stats.sample(frac=1.0, random_state=42).reset_index(drop=True)
    
    target_train_samples = 0.80 * total_samples
    current_train_samples = 0
    train_blocks_list = []
    test_blocks_list = []
    
    for idx, row in shuffled_blocks.iterrows():
        b_id = row['spatial_block']
        b_count = row['sample_count']
        
        # Add to train if under 80% target threshold and test has sufficient balance
        if current_train_samples < target_train_samples or len(test_blocks_list) == 0:
            train_blocks_list.append(b_id)
            current_train_samples += b_count
        else:
            test_blocks_list.append(b_id)
            
    # Ensure test set is non-empty and contains both classes
    train_mask = df['spatial_block'].isin(train_blocks_list)
    test_mask  = df['spatial_block'].isin(test_blocks_list)
    
    df_train = df[train_mask].copy()
    df_test  = df[test_mask].copy()
    
    # Finalize Block Assignment Table
    block_stats['assigned_partition'] = np.where(block_stats['spatial_block'].isin(train_blocks_list), 'train', 'test')
    
    # 3. Partition Diagnostics & Class Counts
    train_count = len(df_train)
    test_count  = len(df_test)
    train_pct   = (train_count / total_samples) * 100
    test_pct    = (test_count / total_samples) * 100
    
    train_c0 = (df_train['hotspot_label'] == 0).sum()
    train_c1 = (df_train['hotspot_label'] == 1).sum()
    train_c0_pct = (train_c0 / train_count * 100) if train_count > 0 else 0
    train_c1_pct = (train_c1 / train_count * 100) if train_count > 0 else 0
    
    test_c0 = (df_test['hotspot_label'] == 0).sum()
    test_c1 = (df_test['hotspot_label'] == 1).sum()
    test_c0_pct = (test_c0 / test_count * 100) if test_count > 0 else 0
    test_c1_pct = (test_c1 / test_count * 100) if test_count > 0 else 0
    
    # 4. Shared Blocks Check
    shared_blocks = set(train_blocks_list).intersection(set(test_blocks_list))
    shared_block_count = len(shared_blocks)
    
    print("PARTITION SPLIT DIAGNOSTICS:")
    print(f"  - Training Partition: {train_count} samples ({train_pct:.2f}%) across {len(train_blocks_list)} spatial blocks")
    print(f"  - Testing Partition:  {test_count} samples ({test_pct:.2f}%) across {len(test_blocks_list)} spatial blocks")
    print(f"  - Shared Spatial Blocks Count: {shared_block_count} (Must be 0)")
    print("-----------------------------------------------------")
    
    print("CLASS DISTRIBUTION BREAKDOWN:")
    print(f"  - Training Class 0 (Cooler Built-up): {train_c0} samples ({train_c0_pct:.2f}%)")
    print(f"  - Training Class 1 (Thermal Hotspot): {train_c1} samples ({train_c1_pct:.2f}%)")
    print(f"  - Testing Class 0 (Cooler Built-up):  {test_c0} samples ({test_c0_pct:.2f}%)")
    print(f"  - Testing Class 1 (Thermal Hotspot):  {test_c1} samples ({test_c1_pct:.2f}%)")
    print("-----------------------------------------------------")
    
    # 5. Variable Role Audit
    predictors = ['NDVI', 'NDBI']
    target = 'hotspot_label'
    metadata = ['longitude', 'latitude', 'spatial_block']
    forbidden = ['LST_Celsius', 'LST', 'ST_B10']
    
    found_forbidden = [c for c in forbidden if c in df_train.columns or c in df_test.columns]
    
    print("VARIABLE ROLE AUDIT & LEAKAGE CHECK:")
    print(f"  - Predictors (X): {predictors} (NDVI and NDBI ONLY)")
    print(f"  - Target (Y): {target}")
    print(f"  - Validation Metadata: {metadata} (EXPLICITLY EXCLUDED FROM ML PREDICTORS)")
    print(f"  - Forbidden Thermal Variables Found: {found_forbidden}")
    print(f"  - Target Leakage Check Result: {'FAIL - Leakage Detected' if found_forbidden else 'PASS - No Leakage'}")
    print("-----------------------------------------------------")
    
    # 6. Methodological Note on Spatial Blocking
    print("METHODOLOGICAL NOTE:")
    print("  Spatial blocking reduces the risk of spatial leakage caused by nearby samples")
    print("  being divided between train and test sets. It does NOT claim to completely eliminate")
    print("  spatial autocorrelation.")
    print("-----------------------------------------------------")
    
    # 7. Output File Specifications
    output_cols = ['NDVI', 'NDBI', 'hotspot_label', 'longitude', 'latitude', 'spatial_block']
    df_train_out = df_train[output_cols]
    df_test_out  = df_test[output_cols]
    
    train_path = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv")
    test_path  = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv")
    blocks_path = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Spatial_Block_Assignment_Step8_2.csv")
    
    df_train_out.to_csv(train_path, index=False)
    df_test_out.to_csv(test_path, index=False)
    block_stats.to_csv(blocks_path, index=False)
    
    print("OUTPUT FILES CREATED:")
    print(f"  1. Train Partition: {train_path} ({len(df_train_out)} rows)")
    print(f"  2. Test Partition:  {test_path} ({len(df_test_out)} rows)")
    print(f"  3. Block Assignments: {blocks_path} ({len(block_stats)} blocks)")
    print("=====================================================")
    
    # Final Validation Status
    valid_split = (shared_block_count == 0) and (train_c0 > 0) and (train_c1 > 0) and (test_c0 > 0) and (test_c1 > 0) and (not found_forbidden)
    print(f"FINAL STEP 8.2 STATUS: {'PASS - READY FOR STEP 8.3' if valid_split else 'FAIL'}")
    print("=====================================================")

if __name__ == "__main__":
    perform_spatial_split()
