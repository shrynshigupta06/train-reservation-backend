const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^S[0-9]{3}$/,
  },
  rowNumber: {
    type: Number,
    required: true,
  },
  isReserved: {
    type: Boolean,
    default: false,
  },
});

const Seat = mongoose.model("Seat", seatSchema);

const initializeSeats = async () => {
  try {
    const totalSeats = 80;
    const seatsPerRow = 7;
    const lastRowSeats = 3;
    const reservedSeatsCount = 10; // Change this value as per your requirement

    // Generate seat layout
    const seatData = [];
    let seatNumber = 1;
    let rowNumber = 1;

    for (let i = 0; i < totalSeats; i++) {
      const formattedSeatNumber = `S${seatNumber.toString().padStart(3, "0")}`;
      seatData.push({
        seatNumber: formattedSeatNumber,
        rowNumber: Math.ceil(seatNumber / seatsPerRow),
        isReserved: false,
      });

      seatNumber++;
    }

    await Seat.insertMany(seatData);

    // Randomly select and reserve seats
    const randomSeats = await Seat.aggregate([
      { $match: { isReserved: false } },
      { $sample: { size: reservedSeatsCount } },
    ]);

    // Set the isReserved flag to true for the randomly selected seats
    for (const seat of randomSeats) {
      await Seat.findByIdAndUpdate(seat._id, { $set: { isReserved: true } });
    }

    console.log("Seat data initialized successfully.");
  } catch (error) {
    console.error("Error initializing seat data:", error);
  }
};

module.exports = { Seat, initializeSeats };
