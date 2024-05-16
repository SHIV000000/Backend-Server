const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const axios = require('axios');

// Initialize the app
const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/backend-server', {});

// JWT Strategy Configuration
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret',
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

app.use(passport.initialize());

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// User Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
});

// User Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Define File Schema
const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
});

const File = mongoose.model('File', fileSchema);

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File Upload Endpoint
app.post('/upload-file', passport.authenticate('jwt', { session: false }), upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'File is required' });
    }

    // Validate file type and size (example: limit size to 5MB)
    if (!['audio/mpeg', 'video/mp4', 'application/pdf'].includes(file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type' });
    }
    if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size exceeds limit' });
    }

    const newFile = new File({
        filename: file.originalname,
        contentType: file.mimetype,
        data: file.buffer,
    });

    await newFile.save();
    res.json({ message: 'File uploaded successfully' });
});

// Sentiment Analysis Endpoint
app.post('/analyze-sentiment', async (req, res) => {
    const text = req.body.text;
    if (!text) {
        return res.status(400).json({ error: 'Text input is required' });
    }

    try {
        const response = await axios.post('http://localhost:5000/analyze-sentiment', { text });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error analyzing sentiment' });
    }
});

// Add a simple GET route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Backend Server');
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
