# DeepGuard AI — Deepfake Detection Platform

A full-stack web application for detecting AI-generated (deepfake) faces in videos and images.
Built on peer-reviewed research published at **IEEE RAAICON 2025**.

---

## Architecture

```

Deep-Guard-AI-Server/          # Flask Python API
   ├── app.py        # REST API server
   ├── train.py      # Model training script
   ├── deepfake-dector-model.h5     # Trained Model  
   └── requirements.txt

Deep-Guard-AI/         # Next.js 14 + TypeScript + TailwindCSS
    └── app/
          ├── components/
          ├── lib/
          └── types/
```

### Model
Hybrid **EfficientNetB0 + Xception** CNN — two pretrained backbone branches run in parallel on each cropped face, their feature vectors concatenated and fed into a classification head. Trained on 110,694 aligned face frames with focal loss to handle severe class imbalance.

---

## Quick Start

### 1 — Train the model (first time)

```bash
cd backend

py -3.11 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

python train.py --dataset "dataset" --output "deepfake_detector_model.h5" --epochs 10 --batch_size 32


```
<!-- python train.py \
  --dataset /path/to/dataset \
  --output  ./deepfake_detector_model.h5 \
  --epochs  10 \
  --batch_size 32 -->




  
**Dataset layout expected:**
```
/path/to/dataset/
    real/        ← authentic face images
    deepfake/    ← AI-generated face images
```

Download the published dataset from Mendeley Data:  
https://data.mendeley.com/datasets/pdcp9mjy3z/2

---

### 2 — Start the backend

```bash
cd backend
pip install -r requirements.txt

# Point to your trained model (default: ./deepfake_detector_model.h5)
MODEL_PATH=./deepfake_detector_model.h5 python app.py
```

The API runs on **http://localhost:8000**.

> **Demo mode**: If the model file is not found, the backend returns realistic dummy predictions so the frontend is fully usable during development.

---

### 3 — Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## API Reference

| Method | Endpoint            | Description                         |
|--------|---------------------|-------------------------------------|
| GET    | `/api/health`       | Health check + model status         |
| POST   | `/api/detect/video` | Analyze a video file (multipart)    |
| POST   | `/api/detect/image` | Analyze an image file (multipart)   |

### Response format
```json
{
  "label": "DEEPFAKE",        // "REAL" | "DEEPFAKE" | "UNKNOWN"
  "confidence": 94.3,         // 0–100 %
  "raw_score": 0.943,         // raw sigmoid output
  "frames_analyzed": 47,
  "faces_found": 132,
  "demo_mode": false
}
```

---

## Supported Formats

| Type   | Formats                          | Max Size |
|--------|----------------------------------|----------|
| Video  | MP4, MOV, AVI, WEBM, MKV        | 500 MB   |
| Image  | JPG, JPEG, PNG, WEBP, BMP        | 500 MB   |

---

## Research & Dataset

- **Paper**: *Building a Balanced Deepfake Dataset: Aligned Faces for Robust Model Training and Evaluation*
- **Conference**: IEEE RAAICON 2025, Dhaka, Bangladesh
- **DOI**: https://doi.org/10.1109/RAAICON69033.2025.11502474
- **Dataset**: https://data.mendeley.com/datasets/pdcp9mjy3z/2

Key dataset stats:
- 480 videos (30 real, 450 fake) · 110,694 frames
- 30 volunteers (15M / 15F) · South Asian demographic
- Dual generation pipeline: Roop Face-Swapper + Akool AI
- Baseline CNN accuracy: **97.8%**

---

## Environment Variables

| Variable     | Default                          | Description              |
|--------------|----------------------------------|--------------------------|
| `MODEL_PATH` | `./deepfake_detector_model.h5`   | Path to trained model    |
| `PORT`       | `8000`                           | Flask server port        |

---

## Notes

- The backend auto-detects model absence and enters **demo mode** — no error, just placeholder results.
- The Next.js dev server proxies `/api/*` requests to `localhost:8000` via `next.config.ts`.
- No Docker required; run backend and frontend as separate processes.
