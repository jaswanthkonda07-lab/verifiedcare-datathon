

## Stage 7B — Run the privacy-preserving ML service on LinuxONE

After starting the main API instructions, open another LinuxONE terminal and run:

```bash
cd verifiedcare-datathon
python3 -m venv .venv
source .venv/bin/activate
cd ml-service
python -m pip install --upgrade pip
pip install -r requirements.txt
python -c "import platform, sklearn; print(platform.machine()); print(sklearn.__version__)"
```

Try XGBoost:

```bash
python -c "import xgboost; print(xgboost.__version__)"
```

Train the model using synthetic metadata only:

```bash
python train_model.py
```

Start the scorer:

```bash
python score_service.py
```

In a third terminal, test it:

```bash
curl http://127.0.0.1:9000/health
curl -X POST http://127.0.0.1:9000/score -H 'Content-Type: application/json' -d '{"features":{"amount_consistency":0.95,"date_consistency":0.96,"hospital_match":0.98,"duplicate_similarity":0.92,"route_consistency":0.94,"consent_present":1.0,"page_count_normal":0.9}}'
```

The response must show the actual model name, architecture, risk, explainable signals, and measured latency. Do not invent accuracy or latency numbers.

Return to the backend terminal and restart the Node API after adding this to `.env`:

```text
ML_SERVICE_URL=http://127.0.0.1:9000
```

Load the file before starting Node:

```bash
set -a
source .env
set +a
node server.js
```

Now `/api/status` should include:

```json
"services": {
  "cloudant": true,
  "audit": true,
  "ml": true
}
```

Run the Jupyter notebook from `ml-service/notebooks/verifiedcare_model_demo.ipynb` on LinuxONE and capture the cell output showing `s390x`, model training, prediction, and real inference latency.
