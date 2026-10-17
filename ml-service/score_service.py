from __future__ import annotations

import json
import platform
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

import numpy as np

try:
    import joblib
except ImportError as exc:
    raise SystemExit("Install joblib before starting the scoring service: pip install joblib") from exc

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "models" / "verifiedcare_models.joblib"
if not MODEL_PATH.exists():
    raise SystemExit("Model file is missing. Run: python train_model.py")
BUNDLE = joblib.load(MODEL_PATH)
FEATURES = BUNDLE["features"]


def score(features: dict) -> dict:
    vector = np.array([[float(features.get(name, 0.0)) for name in FEATURES]])
    start = time.perf_counter()
    risk_probability = float(BUNDLE["classifier"].predict_proba(vector)[0][1]) if hasattr(BUNDLE["classifier"], "predict_proba") else float(BUNDLE["classifier"].predict(vector)[0])
    anomaly_value = int(BUNDLE["anomaly"].predict(vector)[0])
    latency_ms = (time.perf_counter() - start) * 1000
    signals = []
    for name in FEATURES:
        if float(features.get(name, 0.0)) < 0.72:
            signals.append(f"{name} needs reviewer attention")
    if anomaly_value == -1:
        signals.append("feature combination differs from the synthetic baseline")
    risk = "high" if risk_probability >= 0.75 else "review" if risk_probability >= 0.4 or anomaly_value == -1 else "low"
    return {"risk": risk, "score": round(risk_probability, 4), "signals": signals or ["no unusual synthetic signal detected"], "model": BUNDLE["model_name"], "architecture": platform.machine(), "latency_ms": round(latency_ms, 3), "humanDecisionRequired": True}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(json.dumps({"ok": True, "service": "verifiedcare-ml", "architecture": platform.machine(), "model": BUNDLE["model_name"]}).encode()); return
        self.send_error(404)

    def do_POST(self):
        if self.path != "/score":
            self.send_error(404); return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length))
            result = score(payload.get("features", payload))
            body = json.dumps(result).encode()
            self.send_response(200); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(body)
        except Exception as exc:
            self.send_response(400); self.send_header("Content-Type", "application/json"); self.end_headers(); self.wfile.write(json.dumps({"error": str(exc)}).encode())


if __name__ == "__main__":
    port = 9000
    print(f"VerifiedCare ML service listening on 127.0.0.1:{port} ({platform.machine()})")
    HTTPServer(("127.0.0.1", port), Handler).serve_forever()
