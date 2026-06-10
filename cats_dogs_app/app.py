import io
import numpy as np
from flask import Flask, request, jsonify, render_template
from PIL import Image
import tensorflow as tf

app = Flask(__name__)

MODEL_PATH = "cats_dogs_cnn_final.keras"
IMG_SIZE = 150

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded!")


def preprocess_image(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = np.expand_dims(arr, axis=0)
    return arr


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        img_bytes = file.read()
        arr = preprocess_image(img_bytes)

        prob = float(model.predict(arr, verbose=0)[0][0])

        label = "Dog" if prob > 0.5 else "Cat"
        confidence = prob if prob > 0.5 else 1 - prob

        return jsonify({
            "label": label,
            "confidence": round(confidence * 100, 1),
            "raw_prob": round(prob, 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)