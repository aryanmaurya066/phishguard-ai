import pandas as pd
from pymongo import MongoClient
from datetime import datetime
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

# -----------------------------
# ✅ Setup
# -----------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["phishing_db"]
collection = db["training_data"]

# -----------------------------
# ✅ Fetch New Data
# -----------------------------
new_data_cursor = collection.find({"used_in_model": False})
new_data = list(new_data_cursor)

if not new_data:
    print("⚠️ No new data found to train.")
    exit()

print(f"✅ Found {len(new_data)} new samples to train.")

# -----------------------------
# ✅ Convert to DataFrame
# -----------------------------
df_new = pd.DataFrame(new_data)
df_new = df_new.dropna(subset=['email_text', 'label'])
df_new['label'] = df_new['label'].str.strip().str.lower()

# -----------------------------
# ✅ Load previous model or create new
# -----------------------------
try:
    model = joblib.load("models/phishing_model.pkl")
    print("✅ Loaded existing model.")
except:
    print("🆕 Creating new model.")
    model = Pipeline([
        ('tfidf', TfidfVectorizer()),
        ('clf', SGDClassifier(loss='log_loss', max_iter=1000, tol=1e-3))
    ])
    # First fit to establish classes
    model.fit(df_new['email_text'], df_new['label'])
else:
    # Incremental update using partial_fit
    X_new = df_new['email_text']
    y_new = df_new['label']
    clf = model.named_steps['clf']
    tfidf = model.named_steps['tfidf']
    X_vect = tfidf.transform(X_new)
    clf.partial_fit(X_vect, y_new, classes=["phishing", "legitimate"])

# -----------------------------
# ✅ Save model
# -----------------------------
joblib.dump(model, "models/phishing_model.pkl")
print("✅ Model updated and saved as phishing_model.pkl")

# -----------------------------
# ✅ Mark data as used
# -----------------------------
ids = [doc['_id'] for doc in new_data]
collection.update_many({"_id": {"$in": ids}}, {"$set": {"used_in_model": True}})
print("✅ Marked data as used in model.")

# -----------------------------
# ✅ Optional: Evaluation (dev only)
# -----------------------------
# You can run validation here if desired
# X_train, X_test, y_train, y_test = train_test_split(df_new['email_text'], df_new['label'], test_size=0.2)
# y_pred = model.predict(X_test)
# print(classification_report(y_test, y_pred))
