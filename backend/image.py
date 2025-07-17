from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains, adjust for production

app.config['UPLOAD_FOLDER'] = 'uploads'

# Connect to MongoDB (adjust connection string as needed)
client = MongoClient('mongodb+srv://ifty:nxzhhhlWutt7PcMh@cluster0.bd9ywas.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0')
db = client['your_database_name']
instructions_collection = db['instructions']

@app.route('/api/submit_image', methods=['POST'])
def submit_image():
    user_id = request.form.get('user_id')
    day = request.form.get('day')  # Keep as string
    index = request.form.get('index')
    image = request.files.get('image')

    if not user_id or not day or index is None or image is None:
        return jsonify({"error": "Missing form data or image"}), 400

    try:
        index = int(index)
    except ValueError:
        return jsonify({"error": "Index must be an integer"}), 400

    filename = secure_filename(image.filename)
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image.save(filepath)

    # Update MongoDB document to mark done and save image path
    result = instructions_collection.update_one(
        {
            "user_id": user_id,
            "day": day,
            f"activities.{index}": {"$exists": True}
        },
        {
            "$set": {
                f"activities.{index}.done": True,
                f"activities.{index}.image_path": filepath
            }
        }
    )

    if result.modified_count == 0:
        return jsonify({"error": "Failed to update activity or activity not found"}), 400

    return jsonify({"message": "Image uploaded and activity marked done"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5006)
