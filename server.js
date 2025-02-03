const express = require('express');
const cors = require('cors');
const connectDB = require('./db.js');
const bcrypt = require('bcrypt');


const mongoose = require('mongoose');

const multer = require('multer');

// Set up multer with memory storage

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const User = require('./models/User');
const File = require('./models/File.js');
const Course = require('./models/Course.js');

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (authHeader) {

        const token = authHeader.split(' ')[1];
        console.log('Checking token');

        jwt.verify(token, 'secretKey', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token is not valid'});
            }

            req.user = user;
            next();
            
        })
    }
}



const app = express();
const PORT = process.env.PORT || 3001;

connectDB();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());



app.get('/api/hello', (req, res) => {
    res.json({ message: 'hello from backend!'});
});


app.post('/api/users', async (req, res) => {

    try {

        const { name, email, password } = req.body;


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

    


        const user = new User({ name, email, hashedPassword });
        await user.save();
        res.status(201).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


app.post('/api/login', async (req, res) => {

    const { email, password }= req.body;

    try {
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email'})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {

            return res.status(401).json({ message: 'Invalid password'});
        }


        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1d'});
        
        // Sending back logged in user's details to be saved in redux store
        res.json({ token, userId: user._id, name: user.name, email: user.email});

        
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const studentId = req.body.studentId; // Access the studentID sent from the client

    if (!file || !studentId) {
        return res.status(400).send('No file uploaded or id missing');
    }

    // Validate the studentID
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).send('Invalid student ID');
    }

    const newFile = new File({
        data: file.buffer,
        contentType: file.mimetype,
        filename: file.originalname,
        owner: new mongoose.Types.ObjectId(studentId), // Convert string ID to ObjectID
    });

    // Save the file to MongoDB
    try {
        await newFile.save();
        res.status(201).json({
            message: 'File saved to database.',
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        });

    } catch (error) {

        res.status(500).send('Error saving file to database: ' + error);
    }

});


app.get('/files/:userId', async (req, res) => {
    const userId = req.params.userId;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid userId');
    }

    try {
        const files = await File.find({ owner: userId });
        res.status(200).json(files);
    } catch (error) {
        res.status(500).send('Error retrieving files:', error.message);
    }
});

app.get('/courses', async (req, res) => {

    try {

        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {

        res.status(500).send('Error retrieving courses:', error.message);
    }
})


app.get('/assignments/:userId', async (req, res) => {
    const userId = req.params.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send('Invalid or missing userId');
    }

    try {

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.status(200).json(user.assignments);
    } catch(eror) {
        res.status(500).send('Error fetching user data: ', error.message);
    }
});

app.post('/api/logout', (req, res) => {
    
 
    
    // Assuming you might store a log of user logouts or update user status
    const userId = req.body.userId;
    console.log(`User ${userId} logged out at ${new Date().toISOString()}`);

    // Since token invalidation is not feasible with stateless JWT by default,
    // just return a success response. The client should delete the token.
    res.status(200).json({ message: "Logged out successfully" });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});