
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const quizRoutes = require('./routes/quizzes');
const userRoutes = require('./routes/users');

app.use(bodyParser.json());
app.use(cors());
app.use('/quizzes', quizRoutes);
app.use('/user', userRoutes);

app.listen(5001, () => console.log('Server running on http://localhost:5001'));