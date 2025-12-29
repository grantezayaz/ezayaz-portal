// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
// For MongoDB Atlas, replace with your connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ezayaz_portal';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Applicant Schema
const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    number1: { type: Number, required: true },
    number2: { type: Number, required: true },
    number3: { type: Number, required: true },
    number4: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Applicant Model
const Applicant = mongoose.model('Applicant', applicantSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all applicants (for company review)
app.get('/api/applicants', async (req, res) => {
    try {
        const applicants = await Applicant.find().sort({ createdAt: -1 });
        res.json(applicants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API endpoint to create a new applicant
app.post('/api/applicants', async (req, res) => {
    try {
        const applicant = new Applicant(req.body);
        const newApplicant = await applicant.save();
        res.status(201).json(newApplicant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('To view applicants, go to: http://localhost:3000/api/applicants');
});