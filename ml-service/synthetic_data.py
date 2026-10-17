from __future__ import annotations

import numpy as np
import pandas as pd

FEATURES = [
    "amount_consistency",
    "date_consistency",
    "hospital_match",
    "duplicate_similarity",
    "route_consistency",
    "consent_present",
    "page_count_normal",
]


def make_dataset(rows: int = 600, seed: int = 42) -> tuple[pd.DataFrame, pd.Series]:
    rng = np.random.default_rng(seed)
    normal = rng.uniform(0.78, 1.0, size=(rows, len(FEATURES)))
    suspicious = rng.uniform(0.05, 0.72, size=(rows, len(FEATURES)))
    labels = rng.binomial(1, 0.25, rows)
    matrix = np.where(labels[:, None] == 1, suspicious, normal)
    frame = pd.DataFrame(matrix, columns=FEATURES)
    return frame, pd.Series(labels, name="review_required")


if __name__ == "__main__":
    x, y = make_dataset()
    print(x.head())
    print("rows:", len(x), "review_required:", int(y.sum()))
