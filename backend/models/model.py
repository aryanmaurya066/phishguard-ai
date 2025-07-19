import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
import joblib

# Step 1: Load the dataset
df = pd.read_csv("phishing_emails.csv")  # Replace with your file
df = df.dropna()
df.columns = df.columns.str.strip()  # Clean column names

# Step 2: Show label distribution
print("Original label distribution:\n", df['label'].value_counts())

# Step 3: Balance dataset (downsample majority class)
phishing = df[df['label'] == 'phishing']
legit = df[df['label'] == 'legitimate']

# Make sure both classes have same count
min_len = min(len(phishing), len(legit))
phishing = phishing.sample(min_len, random_state=42)
legit = legit.sample(min_len, random_state=42)

# Combine and shuffle
df_balanced = pd.concat([phishing, legit])
df_balanced = df_balanced.sample(frac=1, random_state=42)

# Step 4: Prepare features and labels
X = df_balanced['email_text']
y = df_balanced['label']

# Step 5: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 6: Build and train model
model = make_pipeline(TfidfVectorizer(lowercase=True), LogisticRegression(class_weight='balanced'))
# model = make_pipeline(TfidfVectorizer(), MultinomialNB())
model.fit(X_train, y_train)

# Step 7: Evaluate
print("Accuracy:", model.score(X_test, y_test))

# Step 8: Save the model
joblib.dump(model, "phishing_model.pkl")
print("✅ Model saved as phishing_model.pkl")
