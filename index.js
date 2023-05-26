const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { initializeSeats } = require('./models/Seats');


// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/train-reservation', {
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


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', require('./routes/seats'));

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
