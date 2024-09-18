const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Conectar a MongoDB Atlas
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir un esquema y un modelo para los usuarios
const userSchema = new mongoose.Schema({
    username: String,
    clicks: Number
});

const User = mongoose.model('User', userSchema);

app.post('/click', async (req, res) => {
    const { username } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
        user = new User({ username, clicks: 0 });
    }
    user.clicks++;
    await user.save();

    const totalClicks = await User.aggregate([{ $group: { _id: null, total: { $sum: "$clicks" } } }]);
    const ranking = await User.find().sort({ clicks: -1 });

    res.json({ totalClicks: totalClicks[0].total, ranking });
});

app.get('/ranking', async (req, res) => {
    const totalClicks = await User.aggregate([{ $group: { _id: null, total: { $sum: "$clicks" } } }]);
    const ranking = await User.find().sort({ clicks: -1 });

    res.json({ totalClicks: totalClicks[0].total, ranking });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
