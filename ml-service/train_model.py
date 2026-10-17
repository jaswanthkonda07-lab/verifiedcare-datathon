from __future__ import annotations

import json
import platform
import time
from pathlib import Path

from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from synthetic_data import FEATURES, make_dataset

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"
MODEL_DIR.mkdir(exist_ok=True)

x, y = make_dataset()
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
classifier = None
model_name = "scikit-learn RandomForestClassifier"
try:
    from xgboost import XGBClassifier
    classifier = XGBClassifier(n_estimators=80, max_depth=3, learning_rate=0.08, eval_metric="logloss", random_state=42)
    classifier.fit(x_train, y_train)
    model_name = "XGBoost XGBClassifier"
except Exception as exc:
    print("XGBoost unavailable; using scikit-learn fallback:", exc)
    classifier = RandomForestClassifier(n_estimators=80, random_state=42)
    classifier.fit(x_train, y_train)

predictions = classifier.predict(x_test)
print("architecture:", platform.machine())
print("model:", model_name)
print("accuracy:", round(float(accuracy_score(y_test, predictions)), 4))
print(classification_report(y_test, predictions))

# IsolationForest provides an independent anomaly signal for unusual feature combinations.
anomaly = IsolationForest(contamination=0.25, random_state=42)
anomaly.fit(x_train)

try:
    import joblib
except ImportError as exc:
    raise SystemExit("Install joblib before training: pip install joblib") from exc

joblib.dump({"classifier": classifier, "anomaly": anomaly, "features": FEATURES, "model_name": model_name}, MODEL_DIR / "verifiedcare_models.joblib")
metadata = {"model_name": model_name, "features": FEATURES, "architecture": platform.machine(), "trained_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
(MODEL_DIR / "metadata.json").write_text(json.dumps(metadata, indent=2))
print("saved:", MODEL_DIR / "verifiedcare_models.joblib")
