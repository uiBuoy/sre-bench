const data = require('../data');
const { v4: uuidv4 } = require('uuid');

exports.createUser = (req, res) => {
    console.log("req.body", req.body)
  const { name, email } = req.body;
  const newUser = { id: uuidv4(), name, email };
  data.users.push(newUser);
  res.status(201).json(newUser);
};

