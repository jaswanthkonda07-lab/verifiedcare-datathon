

## Outcome 7 — Run real AI/ML on LinuxONE

- [x] `ml-service/` includes synthetic training data, IsolationForest anomaly detection, XGBoost-compatible classification with a scikit-learn fallback, scoring API, requirements, and Jupyter notebook.
- [x] Node `/api/documents/preflight` can call the internal ML scorer and return risk, model, explainable signals, and measured latency.
- [ ] The team must install the packages in LinuxONE, train the model there, run the scorer, and capture actual `s390x` and model outputs.
- [ ] The team must complete and show the required AI/ML labs if the participant guide marks them mandatory.
- [ ] The team must not claim Telum/NNPA acceleration, XGBoost, or IBM Granite unless the LinuxONE environment and evidence confirm it.
