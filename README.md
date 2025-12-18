# 🛡️ DeepShield — AI Authenticity Detection System

DeepShield is a **web-based AI authenticity detection platform** that identifies whether **text or images are AI-generated**.
It provides **real-time inference**, **confidence scoring**, and a **modern, minimal UI** for seamless user experience.

The system uses a **FastAPI backend** integrated with **Hugging Face Inference APIs** and a **Next.js + TailwindCSS frontend**.

---

## 🚀 Features

### ✍️ Text Authenticity Detection

* Paste or type text (minimum 50 characters)
* Uses a **RoBERTa-based AI text classifier**
* Returns:

  * `ai-generated` or `real`
  * Confidence score (0–1)

### 🖼️ Image Authenticity Detection

* Drag-and-drop or click-to-upload images
* Supported formats: **JPG, PNG, WebP**
* Uses **Google PaliGemma (Vision-Language Model)** via Hugging Face Router
* Outputs AI/Real classification with confidence

### 📊 Results Visualization

* Animated confidence gauge
* Color-coded results:

  * 🔴 AI-generated
  * 🟢 Real
* Smooth transitions and responsive UI

### ⚠️ Robust Error Handling

* Friendly error messages for:

  * Invalid file types
  * Missing input
  * Backend unreachable
  * Slow or cold-start Hugging Face models

---

## 🧱 Tech Stack

### Frontend

* **Next.js**
* **TypeScript**
* **TailwindCSS**
* Client-side animations & state management

### Backend

* **FastAPI**
* **Python**
* Hugging Face **Inference API**
* Environment-based secrets (`.env`)

### Models Used

* **Text**: `roberta-base-openai-detector`
* **Image**: `google/paligemma2-3b-mix-224`

---

## 🏗️ Architecture Overview

```
Frontend (Next.js) ──HTTP──▶ FastAPI Backend ──HTTPS──▶ Hugging Face Router
        ▲                              │
        └──────── JSON Results ◀───────┘
```

* Frontend runs on **localhost:3000**
* Backend runs on **localhost:8000**
* No user data is stored; everything is processed in-memory

---

## 📁 Project Structure (High-Level)

```
DeepShield/
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── .env
│
├── frontend/
│   ├── app/
│   ├── components/
│   │   ├── TextDetector.tsx
│   │   ├── UploadBox.tsx
│   │   └── ResultsPanel.tsx
│   └── styles/
│
└── README.md
```

---

## 🔌 API Endpoints

### Text Analysis

```http
POST /analyze/text
```

**Request**

```json
{
  "text": "Your input text here"
}
```

**Response**

```json
{
  "label": "ai-generated",
  "confidence": 0.92
}
```

---

### Image Analysis

```http
POST /analyze/image
```

* Content-Type: `multipart/form-data`

**Response**

```json
{
  "label": "real",
  "confidence": 0.87
}
```

---

## ⚡ Performance Targets

| Metric          | Target    |
| --------------- | --------- |
| Text inference  | < 0.8 sec |
| Image inference | 1–6 sec   |
| Frontend TTI    | < 1.2 sec |
| Max image size  | 5 MB      |

---

## 🔐 Security & Privacy

* No user data is stored
* All processing is in-memory
* Hugging Face API token stored **only in backend `.env`**
* HTTPS required for deployment
* CORS restricted to frontend origin

---

## ⚠️ Limitations

* ❌ Not a plagiarism checker
* ❌ No video deepfake detection (yet)
* ❌ No permanent storage or user accounts
* ❌ No document rewriting or formatting

---

## 🔮 Future Enhancements

* 🎥 Video deepfake detection
* 📄 PDF & document-level analysis
* 🧬 Multi-model consensus scoring
* 🗂️ User history & exportable reports
* 🖼️ Synthetic image fingerprinting

---

## ✅ Acceptance Criteria

* End-to-end functionality between frontend (3000) and backend (8000)
* Accurate AI/Real labels with stable confidence scores
* Graceful error handling (no raw stack traces)
* Works locally without 404s or CORS issues

---

## 👤 Owner

**Prachi Choudhary**
Project: *DeepShield*
Last Updated: **12 Dec 2025**
