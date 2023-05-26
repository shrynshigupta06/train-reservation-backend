const { Seat } = require('../models/Seats')

module.exports.getSeats = async (req, res) => {
    try {
        const seats = await Seat.find({ isReserved: false });
        res.json(seats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports.reserveSeats = async (req, res) => {
    const { numSeats } = req.body;
    try {
      const allSeats = await Seat.find({ isReserved: false });
  
      if (allSeats.length < numSeats) {
        res.status(400).json({ error: 'Seats not available' });
        return;
      }
  
      let seats = [];
  
      // Check if numSeats can be reserved in one row
      const availableSeatsInOneRow = allSeats.filter((seat) => seat.rowNumber <= 7 && seat.isReserved === false);

      if (availableSeatsInOneRow.length >= numSeats) {
        seats = availableSeatsInOneRow.slice(0, numSeats);
      } else {
        // Reserve seats nearby
        const reservedSeatsInOneRow = allSeats.filter((seat) => seat.rowNumber <= 7 && seat.isReserved === true);
        const adjacentSeats = [];
  
        for (let i = 0; i < reservedSeatsInOneRow.length; i++) {
          if (adjacentSeats.length === numSeats) {
            break;
          }
  
          const currentSeat = reservedSeatsInOneRow[i];
          const nextSeat = reservedSeatsInOneRow[i + 1];
  
          adjacentSeats.push(currentSeat);
  
          if (nextSeat && nextSeat.seatNumber - currentSeat.seatNumber > 1) {
            const difference = nextSeat.seatNumber - currentSeat.seatNumber - 1;
            const additionalSeats = allSeats.slice(currentSeat.seatNumber, currentSeat.seatNumber + difference);
            adjacentSeats.push(...additionalSeats);
          }
        }
  
        if (adjacentSeats.length >= numSeats) {
          seats = adjacentSeats.slice(0, numSeats);
        } else {
          res.status(400).json({ error: 'Seats not available' });
          return;
        }
      }
  
      const seatNumbers = seats.map((seat) => seat.seatNumber);
  
      await Seat.updateMany({ _id: { $in: seats.map((seat) => seat._id) } }, { isReserved: true });
  
      // Get the reserved seats
      const reservedSeats = await Seat.find({ seatNumber: { $in: seatNumbers } });
  
      res.json({ seatNumbers, reservedSeats });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  