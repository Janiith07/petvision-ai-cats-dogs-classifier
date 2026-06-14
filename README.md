# 🐾 PetVision AI — Cats vs Dogs CNN Classifier


## 📌 Introduction

PetVision AI is an end-to-end deep learning project that classifies images of cats and dogs using a custom Convolutional Neural Network (CNN) built from scratch — no transfer learning. The model is trained on a balanced dataset using TensorFlow/Keras with data augmentation and hyperparameter optimization via Keras Tuner (Bayesian search). A polished Flask web application with drag-and-drop image upload, animated UI, and live confidence scoring serves as the frontend, delivering real-time predictions in the browser.

The project is split into two components:

- `ml_pipeline/` — Jupyter Notebook with the full training pipeline (Google Colab)
- `cats_dogs_app/` — Flask web app that loads the saved model and serves predictions

---

## 🛠️ Technologies Used

### Machine Learning

- Python 3.10+
- TensorFlow / Keras — model building and training
- Keras Tuner (Bayesian Optimization) — hyperparameter search
- NumPy — array operations and image preprocessing
- Pillow (PIL) — image loading and resizing
- Scikit-learn — confusion matrix and classification report
- Matplotlib / Seaborn — training curve and EDA visualizations
- opendatasets — Kaggle dataset download in Colab

### Web Application

- Flask — lightweight Python web server
- HTML5 / CSS3 / Vanilla JavaScript — frontend UI
- Google Fonts (Inter) — typography

### Model Architecture (CNN built from scratch)

- 4 convolutional blocks (Conv2D → BatchNorm → MaxPool → Dropout)
- Filter progression: 32 → 64 → 128 → 256
- GlobalAveragePooling2D + Dense classifier head
- Input size: 150 × 150 × 3 (RGB)
- Output: sigmoid activation (0 = cat, 1 = dog)

---

## 📁 Project Structure

```
petvision-ai-cats-dogs-classifier/
├── ml_pipeline/
│   └── cnn_pipeline.ipynb        # Full training pipeline (Google Colab)
└── cats_dogs_app/
    ├── app.py                    # Flask application + /predict endpoint
    ├── requirements.txt          # Python dependencies
    ├── cats_dogs_cnn_final.keras # Trained model (included)
    ├── static/
    │   ├── css/style.css         # Styled UI
    │   ├── js/main.js            # Frontend logic (drag & drop, state machine)
    │   └── img/                  # Background assets
    └── templates/
        └── index.html            # Main HTML page
```

---

## 🚀 Local Setup Instructions

### Prerequisites

- Python 3.10 or higher
- pip package manager
- (Optional) A virtual environment tool such as venv or conda

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/petvision-ai-cats-dogs-classifier.git
cd petvision-ai-cats-dogs-classifier
```

### Step 2 — Create and activate a virtual environment (recommended)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3 — Install dependencies

```bash
cd cats_dogs_app
pip install -r requirements.txt
```

> The requirements.txt installs: flask, tensorflow, pillow, numpy

### Step 4 — Run the Flask application

```bash
python app.py
```

You should see:

```
Loading model...
Model loaded!
 * Running on http://127.0.0.1:5000
```

### Step 5 — Open in your browser

Navigate to: **http://localhost:5000**

Upload any cat or dog image using drag & drop or the file picker, then click **Classify Image** to get a prediction with a confidence score.

---

## 🧠 How It Works

1. The user uploads an image via the web UI.
2. The Flask backend receives it at the `/predict` endpoint.
3. The image is resized to 150×150 pixels and normalized to [0, 1].
4. The trained CNN model performs inference and returns a sigmoid probability.
5. Probability > 0.5 → **Dog**, otherwise → **Cat**. The confidence score is displayed alongside a visual probability bar.

---

## 📓 Training Pipeline (Google Colab)

To retrain the model, open `ml_pipeline/cnn_pipeline.ipynb` in Google Colab.

- **Dataset:** Cats and Dogs for Classification (Kaggle — downloaded via opendatasets)
- **Augmentation:** rotation, width/height shift, shear, zoom, horizontal flip
- **Optimizer:** Adam (lr = 1e-3)
- **Loss:** Binary Crossentropy
- **Callbacks:** EarlyStopping (patience=8), ModelCheckpoint, ReduceLROnPlateau
- **Max epochs:** 50 (early stopping applies)



