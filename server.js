const express = require('express');
const cors = require('cors');
const connectDB = require('./db.js');
const bcrypt = require('bcrypt');

const User = require('./models/User');


const jwt = require('jsonwebtoken');





const app = express();
const PORT = process.env.PORT || 3001;

connectDB();


app.use(express.json());
app.use(cors());

app.get('/api/hello', (req, res) => {
    res.json({ message: 'hello from backend!'});
});


app.post('/api/users', async (req, res) => {

    try {

        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


app.post('/api/login', async (req, res) => {

    const { email, password }= req.body;

    console.log(email);

    try {


        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email'})
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {

            return res.status(401).json({ message: 'Invalid password'});
        }



        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1d'});
        res.json({ token, userId: user._id, name: user.name, email: user.email});

        console.log(user.name + ' logged in.');
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});