const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { initializeSeats } = require('./models/Seats');


const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;
const dbConnectionString = process.env.DB_CONNECTION_STRING;

// Connect to MongoDB
mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    initializeSeats();
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });


app.use('/api', require('./routes/seats'));

// Start the server
app.listen(port, () => {
  console.log('Server started on port 3000');
});
