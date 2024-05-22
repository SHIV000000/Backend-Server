# Backend-Server
This project is a backend server application that includes user authentication, file upload functionality, and sentiment analysis using a machine learning model. The server is built using Node.js, Express, and MongoDB. Sentiment analysis is performed using a Python backend with a scikit-learn model.

## Project Structure
```go

backend-server/
│
├── node_modules/
├── index.js
├── package.json
├── package-lock.json
│
├── python-backend/
│   ├── venv/
│   ├── app.py
│   ├── train_model.py
│   ├── sentiment_model.pkl
│   └── vectorizer.pkl
│
└── README.md

```
## Prerequisites:
```
Node.js (v12 or higher)
MongoDB
Python (v3.6 or higher)
Postman (optional, for testing API endpoints)
```

## Installation and Setup

### Clone the repository
```bash
git clone https://github.com/SHIV000000/Backend-Server
```
```bash
cd backend-server
```
### Set up the Node.js backend
## Install dependencies:

```bash
npm install express mongoose multer jsonwebtoken bcrypt passport passport-jwt body-parser axios
```

## Set up the Python backend
### Navigate to the python-backend directory:

```bash
cd python-backend
```
### Set up a virtual environment:

```bash
python -m venv venv
```
###  on Macos\Linux, use  `source venv/bin/activate`  # On Windows, use `venv\Scripts\activate`

### Install dependencies:

```bash

pip install Flask scikit-learn joblib
```
### Train the sentiment analysis model and save it:

```bash

python train_model.py
```
## Run the Flask app:

```bash
python app.py
```

## Run the Node.js backend

### Navigate back to the backend-server directory:

```bash
cd backend-server
```
Start the Node.js server:

```bash
node index.js
```

API Endpoints
User Registration
URL: /register
Method: POST
Request Body:

``` json

{
    "username": "string",
    "password": "string"
}
```
Response:
 
``` json

{
    "message": "User registered successfully"
}
``` 
User Login
URL: /login
Method: POST
Request Body:

``` json

{
    "username": "string",
    "password": "string"
}
``` 
### Response:

``` json

{
    "token": "string"
}
``` 
File Upload
URL: /upload-file
Method: POST

### Headers:

```json

{
    "Authorization": "Bearer <token>"
}
```
Form Data:
file: File to be uploaded

### Response:

```json

{
    "message": "File uploaded successfully"
}
```
### Sentiment Analysis
URL: /analyze-sentiment
Method: POST
Request Body:

```json

{
    "text": "string"
}
```
### Response:

```json

{
    "sentiment": "positive" | "negative"
}
```
### Code Explanation

Node.js (index.js)
Dependencies: The necessary modules are imported, including Express, Mongoose, Multer, JWT, Passport, bcrypt, and Axios.
MongoDB Connection: Connects to the MongoDB database.
Passport JWT Strategy: Sets up JWT authentication using Passport.
User Schema: Defines the user model schema with Mongoose.
Routes:
/register: Handles user registration.
/login: Handles user login and JWT token generation.
/upload-file: Handles file uploads, validating file type and size.
/analyze-sentiment: Forwards text data to the Python backend for sentiment analysis.
Server Setup: Starts the Express server on port 3000.
Python (python-backend/app.py)
Dependencies: Imports Flask, scikit-learn, joblib, and os.
Model Loading: Loads the pre-trained sentiment analysis model and vectorizer.
Routes:
/analyze-sentiment: Accepts text data, processes it with the sentiment analysis model, and returns the result.
Server Setup: Starts the Flask server on port 5000.
Python (python-backend/train_model.py)
Dependencies: Imports scikit-learn and joblib.
Model Training:
Loads training data and vectorizes it.
Trains a Logistic Regression model for sentiment analysis.
Saves the trained model and vectorizer to disk.
Testing Using Postman
Register a new user via the /register endpoint.
Log in with the registered user via the /login endpoint and obtain the JWT token.
Upload a file via the /upload-file endpoint using the obtained JWT token.
Analyze sentiment via the /analyze-sentiment endpoint.
Using curl

Register a new user:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser", "password":"password"}' http://localhost:3000/register
```
### Log in with the registered user:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"username":"testuser", "password":"password"}' http://localhost:3000/login
```
### Upload a file:

```bash

curl -X POST -H "Authorization: Bearer <token>" -F "file=@path_to_your_file" http://localhost:3000/upload-file
Analyze sentiment:
```
```bash

curl -X POST -H "Content-Type: application/json" -d '{"text":"I love programming!"}' http://localhost:3000/analyze-sentiment
```
## Conclusion
This project demonstrates a full-stack application integrating Node.js with a Python backend for machine learning. The Node.js server handles user authentication, file uploads, and delegates sentiment analysis to the Python backend, which uses a scikit-learn model for predictions. This setup provides a scalable architecture for incorporating advanced machine learning models into web applications.
