from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # reads your .env file locally

app = Flask(__name__)
CORS(app)

FACEPP_KEY    = os.environ.get("FACEPP_KEY")
FACEPP_SECRET = os.environ.get("FACEPP_SECRET")
FACEPP_URL    = "https://api-us.faceplusplus.com/facepp/v1/skinanalyze"

SOLUTIONS = {
    "dark_circle": "Use vitamin C serum and ensure 7–8 hours of sleep nightly.",
    "acne":        "Apply benzoyl peroxide 2.5% cleanser or salicylic acid face wash.",
    "wrinkle":     "Use retinol cream at night; apply SPF 30+ sunscreen every morning.",
    "skin_spot":   "Try niacinamide 10% serum daily and minimize sun exposure.",
    "eye_pouch":   "Use cold compresses in the morning and a caffeine-based eye cream.",
    "blackhead":   "Use a BHA (salicylic acid) exfoliant 2–3 times a week.",
    "oiliness":    "Use a foaming cleanser and oil-free, non-comedogenic moisturiser.",
}

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Skin Analyzer API is running."})

@app.route("/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded. Please attach an image."}), 400

    image_file = request.files["image"]

    try:
        facepp_response = requests.post(
            FACEPP_URL,
            data={
                "api_key": FACEPP_KEY,
                "api_secret": FACEPP_SECRET,
            },
            files={"image_file": image_file},
            timeout=20
        )
        data = facepp_response.json()
    except Exception as e:
        return jsonify({"error": f"Could not reach Face++ API: {str(e)}"}), 500

    if "result" not in data:
        msg = data.get("error_message", "Face++ could not detect a face. Use a clear, well-lit photo.")
        return jsonify({"error": msg}), 400

    skin = data["result"]

    skin_checks = {
        "dark_circle": skin.get("dark_circle", {}).get("value", 0),
        "acne":        skin.get("acne", {}).get("value", 0),
        "wrinkle":     skin.get("wrinkle", {}).get("value", 0),
        "skin_spot":   skin.get("skin_spot", {}).get("value", 0),
        "eye_pouch":   skin.get("eye_pouch", {}).get("value", 0),
        "blackhead":   skin.get("blackhead", {}).get("value", 0),
        "oiliness":    skin.get("oiliness", {}).get("value", 0),
    }

    issues = []
    for key, score in skin_checks.items():
        if score > 25:
            issues.append({
                "issue":    key.replace("_", " ").title(),
                "severity": round(score),
                "solution": SOLUTIONS.get(key, "Consult a dermatologist for personalised advice.")
            })

    issues.sort(key=lambda x: x["severity"], reverse=True)

    return jsonify({
        "issues":    issues,
        "total":     len(issues),
        "skin_type": skin.get("skin_type", {}).get("skin_type", "Unknown")
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)