# VerifiedCare ML service

This service is designed to run inside the LinuxONE environment and receive privacy-preserving metadata features rather than raw patient documents. It trains an anomaly detector with scikit-learn and uses XGBoost when the package successfully installs; it falls back to scikit-learn RandomForestClassifier and prints which model was actually used.

## LinuxONE setup

```bash
cd verifiedcare-datathon/ml-service
python3 -m venv ../.venv
source ../.venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install joblib
python -c "import platform, sklearn; print(platform.machine()); print(sklearn.__version__)"
python -c "import xgboost; print(xgboost.__version__)"
```

If XGBoost does not install on the provided image, keep the printed fallback and explain it honestly in the video.

## Train and run

```bash
python train_model.py
python score_service.py
```

The model is created under `models/`, which is generated on LinuxONE and should be committed only if the team wants to preserve the artifact. Never train on real patient documents.

Test the service from another LinuxONE terminal:

```bash
curl http://127.0.0.1:9000/health
curl -X POST http://127.0.0.1:9000/score \
  -H 'Content-Type: application/json' \
  -d '{"features":{"amount_consistency":0.95,"date_consistency":0.96,"hospital_match":0.98,"duplicate_similarity":0.92,"route_consistency":0.94,"consent_present":1.0,"page_count_normal":0.9}}'
```

Capture the model name, architecture (`s390x`), risk, signals, and measured latency. Do not invent values.
