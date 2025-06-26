from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # ✅ Allow requests from frontend

# ✅ Connect to MongoDB
client = MongoClient(
    "mongodb+srv://ifty:nxzhhhlWutt7PcMh@cluster0.bd9ywas.mongodb.net/"
    "mydatabase?retryWrites=true&w=majority&appName=Cluster0"
)
db = client["mydatabase"]
collection = db["daywise_instructions"]
users_collection = db["users"]

# ✅ Reusable activity builder
def activity(description, period, time_range, done=False):
    return {
        "description": description,
        "period": period,
        "time_range": time_range,
        "done": done
    }

# ✅ Create default docs
def create_default_docs():
    return [
    {
        "day": "Day 1",
        "activities": [
            activity("সূর্যের আলোয় ৪ ঘণ্টা বীজ শুকিয়ে নিন।", "সকাল", "৭টা – ১২টা",False),
            activity("স্বাভাবিক তাপমাত্রায় বীজকে ঠান্ডা করে নিন।", "দুপুর", "১২টা – ৪টা",False),
            activity("পানিতে ৬ ঘণ্টা ভিজিয়ে রাখুন।", "বিকাল – রাত", "৪টা – ১০টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Day 2",
        "activities": [
            activity("প্রতি কেজি বীজের সাথে ১০ গ্রাম ট্রাইকোডার্মা মিশিয়ে নিন।", "সকাল", "৬টা – ৭টা",False),
            activity("বীজকে শুকিয়ে নিন (সরাসরি সূর্যের তাপ দেয়া যাবেনা)", "সকাল", "৭টা – ১০টা",False),
            activity("বীজকে ২গ্রাম/লিটার জিবেরেলিক এসিড (GA3 10%) মিশ্রনে ১০ মিনিট ডুবিয়ে রেখে বাতাসে শুকিয়ে নিন।", "সকাল", "১০টা – ১১টা",False),
            activity("একটি হালকা আর্দ্র কাপড়ে বীজ বেঁধে পুত্তলি বানিয়ে ২১ ঘণ্টা শুষ্ক জায়গায় রাখুন।", "সকাল", "১১টা – ৮টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Day 3",
        "activities": [
            activity("বীজ বপন করুন এবং ছায়াযুক্ত স্থানে রাখুন।", "সকাল", "৬টা – ৮টা",False),
            activity("বীজ বপনের সময় অঙ্কুরোদ্গম না", "সকাল", "৬টা – ৮টা",False),
        ],
        "special_statements": {
            "procedure": "বীজ বপন পদ্ধতিঃ বীজকে প্রথমে অঙ্কুরোদ্গম করে নিতে হবে...",
            "warning": "সতর্কীকরণঃ চারার সুস্থ বৃদ্ধির জন্য শিডিউল স্প্রে..."
        },
        "extra_work":[]
    },
    {
        "day": "Seed Day 01",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কল্যাণ ৩ গ্রাম/লিটার + নেয়ামত ০.৫গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]

    },
    {
        "day": "Seed Day 02",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কল্যাণ ৩ গ্রাম/লিটার + নেয়ামত ০.৫গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]

    },
    {
        "day": "Seed Day 03",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কল্যাণ ৩ গ্রাম/লিটার + নেয়ামত ০.৫গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]

    },
    {
        "day": "Seed Day 04",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কল্যাণ ৩ গ্রাম/লিটার + নেয়ামত ০.৫গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]

    },
    {
        "day": "Seed Day 05",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> ক্রপ মাস্টার ৫ গ্রাম/লিটার + ম্যাট্রিক্সিন ১ মিলি/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 06",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> ক্রপ মাস্টার ৫ গ্রাম/লিটার + ম্যাট্রিক্সিন ১ মিলি/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 07",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 08",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 09",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 10",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কল্যান ৩ গ্রাম/লিটার + প্রোফাইটা ১ মিলি/লিটার + ইয়োকা ১ মিলি/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 11",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কল্যান ৩ গ্রাম/লিটার + প্রোফাইটা ১ মিলি/লিটার + ইয়োকা ১ মিলি/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 12",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 13",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 14",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 15",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> গ্রিন প্লাস ১মিলি/লিটার + চিলেটেট জিঙ্ক ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 16",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> গ্রিন প্লাস ১মিলি/লিটার + চিলেটেট জিঙ্ক ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 17",
        "activities": [
            activity("উপরি সার প্রয়োগ ----> ১ম কিস্তি উপরি সার প্রয়োগঃ DAP – ২০০ গ্রাম/শতক + TSP – ১৫০গ্রাম/শতক", "সকাল", "৮-৯.৩০টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 18",
        "activities": [
            activity("উপরি সার প্রয়োগ ----> ১ম কিস্তি উপরি সার প্রয়োগঃ DAP – ২০০ গ্রাম/শতক + TSP – ১৫০গ্রাম/শতক", "সকাল", "৮-৯.৩০টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 19",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 20",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কপাল ২ গ্রাম/লিটার + নেয়ামত ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 21",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কপাল ২ গ্রাম/লিটার + নেয়ামত ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 22",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কপাল ২ গ্রাম/লিটার + নেয়ামত ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 23",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কপাল ২ গ্রাম/লিটার + নেয়ামত ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 24",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> কপাল ২ গ্রাম/লিটার + নেয়ামত ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 25",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> গ্রিন প্লাস ১মিলি/লিটার + চিলেটেট জিঙ্ক ০.৫ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 26",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 27",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 28",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 29",
        "activities": [
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন... চারার গোড়ার আগাছা তোলাঃ...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    },
    {
        "day": "Seed Day 30",
        "activities": [
            activity("দমন ব্যবস্থাপনা ---> সম্পদ ১.৫ গ্রাম/লিটার + ইয়োকো ১ মিলি/লিটার + স্টারথেন ১ গ্রাম/লিটার", "সকাল", "৭-৮টা",False),
            activity("পরিচর্যা ---> কোন চারা রোগাক্রান্ত হলে তা দ্রুত তুলে ফেলুন...", "সকাল", "৯-১১টা",False),
        ],
        "extra_work":[]
    }
    ]

# ✅ Get instructions for a specific user
@app.route("/api/instructions", methods=["POST"])
def get_instructions():
    data = request.json
    user_id = data.get("user_id")
    phase = data.get("phase")
    day_num = data.get("day")

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Check if user exists
    if not users_collection.find_one({"email": user_id}):
        return jsonify({"error": "User email does not exist."}), 404

    try:
        day_num = int(day_num)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid day number"}), 400

    if phase == "জমি প্রস্তুতকালীন সময়কাল":
        day_string = f"Day {day_num}"
    elif phase == "সংবেদনশীল সময়কাল":
        day_string = f"Seed Day {day_num:02d}"
    else:
        return jsonify({"error": "Invalid phase"}), 400

    user_doc = collection.find_one({"userId": user_id})

    if not user_doc:
        # New user: insert default docs
        docs = create_default_docs()
        user_doc = {"userId": user_id, "docs": docs}
        collection.insert_one(user_doc)

    # Find correct day object
    day_doc = next((d for d in user_doc["docs"] if d["day"] == day_string), None)
    if not day_doc:
        return jsonify({"error": "Day not found"}), 404

    return jsonify(day_doc)

# ✅ Update "done" status of an activity
@app.route("/api/update_done", methods=["POST"])
def update_done():
    data = request.json
    user_id = data.get("user_id")
    day = data.get("day")
    index = data.get("index")
    done = data.get("done")

    if not all([user_id, day]) or not isinstance(index, int) or not isinstance(done, bool):
        return jsonify({"error": "Invalid data"}), 400

    user_doc = collection.find_one({"userId": user_id})
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    docs = user_doc.get("docs", [])
    for i, d in enumerate(docs):
        if d["day"] == day:
            if 0 <= index < len(d["activities"]):
                docs[i]["activities"][index]["done"] = done
                collection.update_one({"_id": user_doc["_id"]}, {"$set": {"docs": docs}})
                return jsonify({"status": "updated"})
            return jsonify({"error": "Invalid activity index"}), 400

    return jsonify({"error": "Day not found"}), 404

# ✅ Move activity to next day's extra_work
@app.route("/api/move_to_extra_work", methods=["POST"])
def move_to_extra_work():
    data = request.json
    user_id = data.get("user_id")
    current_day = data.get("day")
    index = data.get("index")

    if not all([user_id, current_day]) or not isinstance(index, int):
        return jsonify({"error": "Invalid data"}), 400

    user_doc = collection.find_one({"userId": user_id})
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    docs = user_doc.get("docs", [])
    current_index = next((i for i, d in enumerate(docs) if d["day"] == current_day), None)
    if current_index is None or current_index + 1 >= len(docs):
        return jsonify({"error": "Next day not found"}), 400

    current_doc = docs[current_index]
    next_doc = docs[current_index + 1]

    if 0 <= index < len(current_doc["activities"]):
        activity = current_doc["activities"].pop(index)
        next_doc.setdefault("extra_work", []).append(activity)
        collection.update_one({"_id": user_doc["_id"]}, {"$set": {"docs": docs}})
        return jsonify({"status": "moved"})
    return jsonify({"error": "Invalid activity index"}), 400

# ✅ Complete and remove extra work
@app.route("/api/complete_and_remove_extra", methods=["POST"])
def complete_and_remove_extra():
    data = request.json
    user_id = data.get("user_id")
    day = data.get("day")
    index = data.get("index")

    if not all([user_id, day]) or not isinstance(index, int):
        return jsonify({"error": "Invalid data"}), 400

    user_doc = collection.find_one({"userId": user_id})
    if not user_doc:
        return jsonify({"error": "User not found"}), 404

    docs = user_doc.get("docs", [])
    day_doc = next((d for d in docs if d["day"] == day), None)

    if not day_doc or index >= len(day_doc.get("extra_work", [])):
        return jsonify({"error": "Invalid index or day"}), 400

    activity = day_doc["extra_work"].pop(index)
    activity["done"] = True
    collection.update_one({"_id": user_doc["_id"]}, {"$set": {"docs": docs}})

    return jsonify({"status": "completed"})

if __name__ == "__main__":
    app.run(port=5000)
