from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
import os

app = Flask(__name__)

# Load pre-trained model and vectorizer
model = joblib.load('sentiment_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

@app.route('/analyze-sentiment', methods=['POST'])
def analyze_sentiment():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'Text input is required'}), 400
    text = data['text']
    features = vectorizer.transform([text])
    prediction = model.predict(features)
    return jsonify({'sentiment': 'positive' if prediction[0] == 1 else 'negative'})

if __name__ == '__main__':
    app.run(debug=True)
