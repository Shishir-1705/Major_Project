# Project Directory Structure Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. Full-Stack Repository Tree

The project directory structure decouples the offline research execution pipeline from the full-stack web application service:

```
d:/Major_Project/
├── README.md                              # Main Project Overview & Setup Instructions
│
├── data/                                  # PERSISTED RESEARCH DATASETS & RASTERS
│   ├── Mysuru_Urban_Heat_Hotspot_Features_Step7.csv
│   ├── Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv
│   ├── Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv
│   ├── step9/                             # Authoritative Step 9 Built-up Mask & Features
│   │   ├── built_mask_30m.tif             # 146,810 built pixels / 132.129 km²
│   │   ├── ndvi_30m.tif
│   │   └── ndbi_30m.tif
│   └── step10/                            # Real Landsat Multi-Temporal Rasters (8 Dates)
│       ├── lst_30m_2023-04-01.tif ... lst_30m_2023-05-27.tif
│       ├── ndvi_30m_2023-04-01.tif ... ndvi_30m_2023-05-27.tif
│       ├── ndbi_30m_2023-04-01.tif ... ndbi_30m_2023-05-27.tif
│       └── ref_label_30m_2023-04-01.tif ... ref_label_30m_2023-05-27.tif
│
├── models/                                # LOCKED MACHINE LEARNING MODEL ARTIFACTS
│   ├── random_forest_final_step10_8.joblib            # Primary Locked Model (SHA-256 Verified)
│   └── random_forest_final_step10_8_metadata.json   # Model Provenance & Metadata
│
├── results/                               # EXPERIMENTAL & EVALUATION OUTPUTS
│   ├── step10/                            # Multi-Temporal Persistence & Gi* Statistics
│   │   ├── categorical_persistence_30m.tif
│   │   ├── continuous_persistence_30m.tif
│   │   ├── gi_star_statistic_30m.tif
│   │   ├── gi_star_clustering_30m.tif
│   │   ├── rf_prob_30m_2023-04-01.tif ... rf_prob_30m_2023-05-27.tif
│   │   └── rf_class_30m_2023-04-01.tif ... rf_class_30m_2023-05-27.tif
│   ├── step10_8/                          # Step 10.8 Training Summaries & Feature Importances
│   ├── step10_9/                          # Step 10.9 Locked Evaluation Metrics & Predictions
│   └── step10_10/                         # Step 10.10 Audit Checklist CSV
│
├── figures/                               # PUBLICATION & AUDIT VISUALIZATIONS
│   ├── step10/                            # Step 10 Multi-Temporal & Persistence Maps
│   ├── step10_8/                          # Final Feature Importance Figure
│   └── step10_9/                          # Confusion Matrix, ROC, PR & Spatial Error Maps
│
├── reports/                               # SCIENTIFIC AUDIT & EVALUATION REPORTS
│   ├── 10_8_final_model_training.md
│   ├── 10_9_final_locked_model_evaluation.md
│   └── 10_10_final_ml_audit_and_lock.md
│
├── scripts/                               # OFFLINE RESEARCH PIPELINE SCRIPTS (Steps 1–10)
│   ├── 01_define_aoi.py
│   ├── 04_compute_ndvi_ndbi.py
│   ├── 05_compute_lst.py
│   ├── 06_create_hotspot_labels.py
│   ├── 08_3_train_random_forest.py
│   ├── 10_extract_real_landsat_data.py
│   └── 10_real_multi_temporal_persistence.py
│
├── docs/                                  # SYSTEM ARCHITECTURE & APPLICATION SPECIFICATIONS
│   ├── system_architecture.md
│   ├── application_data_flow.md
│   ├── frontend_design_system.md
│   ├── api_architecture.md
│   ├── project_directory_structure.md
│   ├── technology_decisions.md
│   ├── ui_wireframe.md
│   ├── architecture_decision_record.md
│   └── architecture_diagram.png
│
├── backend/                               # FASTAPI BACKEND WEB SERVICE (Proposed Structure)
│   ├── app/
│   │   ├── api/                           # Endpoint Controllers
│   │   │   ├── metadata.py
│   │   │   ├── tiles.py
│   │   │   ├── statistics.py
│   │   │   └── model_info.py
│   │   ├── core/                          # Configuration & Security
│   │   │   └── config.py
│   │   ├── services/                      # Raster Processing & Tile Server
│   │   │   ├── raster_service.py
│   │   │   └── stats_service.py
│   │   └── main.py                        # FastAPI Application Entry
│   ├── requirements.txt                   # Backend Python Dependencies
│   └── uvicorn_config.py
│
└── frontend/                              # REACT FRONTEND DASHBOARD (Proposed Structure)
    ├── src/
    │   ├── components/                    # UI Components
    │   │   ├── Header.tsx
    │   │   ├── LayerControl.tsx
    │   │   ├── MapWorkspace.tsx
    │   │   ├── MapLegend.tsx
    │   │   ├── AnalyticsPanel.tsx
    │   │   ├── ModelInfoCard.tsx
    │   │   └── TimelineSlider.tsx
    │   ├── store/                         # Zustand Global State
    │   │   └── useAppStore.ts
    │   ├── services/                      # Axios API Client
    │   │   └── api.ts
    │   ├── types/                         # TypeScript Interfaces
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 2. Directory Governance Rules

1. **`models/` & `data/` Read-Only**: The backend service accesses model files and GeoTIFF rasters with read-only permissions.
2. **`scripts/` Offline Isolation**: Research pipeline scripts in `scripts/` are executed offline and never invoked by backend HTTP routes.
3. **`frontend/` & `backend/` Separation**: Clear decoupling allows independent building, testing, and containerization (e.g., Docker) of web service layers.
