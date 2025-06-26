from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Allow access from frontend like React

# MongoDB connection
client = MongoClient("mongodb+srv://ifty:nxzhhhlWutt7PcMh@cluster0.bd9ywas.mongodb.net/")
db = client["mydatabase"]
collection = db["daywise_instructions"]

# Helper to serialize ObjectId
def serialize(document):
    document["_id"] = str(document["_id"])
    return document

# ✅ GET all daywise instructions
@app.route("/api/instructions", methods=["GET"])
def get_instructions():
    instructions = list(collection.find({}, {"_id": 1, "userId": 1, "docs": 1}))
    for doc in instructions:
        doc = serialize(doc)
    return jsonify([serialize(doc) for doc in instructions])

# ✅ DELETE instruction by ID
@app.route("/api/instructions/<id>", methods=["DELETE"])
def delete_instruction(id):
    result = collection.delete_one({"_id": ObjectId(id)})
    return jsonify({"deleted": result.deleted_count})

# ✅ PUT (edit userId)
@app.route("/api/instructions/<id>", methods=["PUT"])
def update_instruction(id):
    data = request.json
    new_userId = data.get("userId")
    if new_userId:
        result = collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {"userId": new_userId}}
        )
        return jsonify({"updated": result.modified_count})
    return jsonify({"error": "No userId provided"}), 400

# ✅ Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5005)
