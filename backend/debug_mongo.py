from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime

MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["phishing_db"]
collection = db["analysis_logs"]

async def debug_mongo():
    try:
        # Check MongoDB connection
        await client.admin.command('ping')
        print("✅ Connected to MongoDB")

        # Check for documents
        count = await collection.count_documents({})
        if count == 0:
            print("⚠️ No documents found. Inserting one sample log.")
            dummy_log = {
                "timestamp": datetime.utcnow().isoformat(),
                "session_id": "debug-session",
                "input": {
                    "email_text": "Test email body",
                    "sender_email": "test@example.com",
                    "urls": ["http://example.com"],
                    "web_content": "<html><body>login</body></html>"
                },
                "result": {
                    "verdict": "legitimate",
                    "score": 20,
                    "modules": {
                        "email_text": {"prediction": "legitimate", "confidence": 89},
                        "sender_email": {"suspicious": False},
                        "urls": [],
                        "web_content": {}
                    }
                }
            }
            await collection.insert_one(dummy_log)
            print("✅ Sample log inserted.")
        else:
            print(f"📦 Documents in 'analysis_logs': {count}")
            latest = await collection.find_one(sort=[("_id", -1)])
            print("🧾 Last log entry:")
            print(latest)

    except Exception as e:
        print(f"❌ MongoDB error: {e}")

asyncio.run(debug_mongo())



# import joblib

# # Load saved model
# model = joblib.load("phishing_model.pkl")

# # Test predictions
# samples = [
#     "Fix the meeting time to 3 PM tomorrow.",
#     "Congratulations! You've won a $1000 gift card. Click here to claim your prize.",
# ]

# for text in samples:
#     prediction = model.predict([text])[0]
#     print(f"Email: {text}\nPrediction: {prediction}\n")
# migrate_csv_to_mongo.py
import pandas as pd
from pymongo import MongoClient
from datetime import datetime

df = pd.read_csv("phishing_emails.csv")  # Replace with your file
df = df.dropna()
df.columns = df.columns.str.strip()

client = MongoClient("mongodb://localhost:27017")
db = client["phishing_db"]
collection = db["training_data"]

for _, row in df.iterrows():
    doc = {
        "email_text": row["email_text"],
        "label": row["label"].strip(),
        "source": "csv",
        "added_at": datetime.utcnow(),
        "used_in_model": False
    }
    collection.insert_one(doc)

print("✅ Data inserted into MongoDB")
