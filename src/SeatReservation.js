import React, { useState } from 'react';
import './App.css';

const SeatReservation = () => {
  const TOTAL_SEATS = 80;
  const SEATS_PER_ROW = 7;

  // Initialize seats state
  const [seats, setSeats] = useState(
    Array.from({ length: TOTAL_SEATS }, (_, i) => ({
      id: i + 1,
      row: Math.ceil((i + 1) / SEATS_PER_ROW),
      isBooked: false,
    }))
  );
  const [error, setError] = useState('');
  const [bookedSeats, setBookedSeats] = useState([]);

  // Function to book seats with row priority
  const bookSeats = (seatCount) => {
    setError('');

    if (seatCount < 1 || seatCount > 7) {
      setError('You can book between 1 to 7 seats only.');
      return;
    }

    const availableSeats = seats.filter((seat) => !seat.isBooked);

    if (availableSeats.length < seatCount) {
      setError('Not enough seats available.');
      return;
    }

    // Group available seats by rows
    const rows = {};
    availableSeats.forEach((seat) => {
      rows[seat.row] = rows[seat.row] || [];
      rows[seat.row].push(seat);
    });

    // Try to book in a single row first
    let booked = [];
    for (const row of Object.values(rows)) {
      if (row.length >= seatCount) {
        booked = row.slice(0, seatCount).map((seat) => seat.id);
        break;
      }
    }

    // If not possible in one row, book nearby seats
    if (booked.length === 0) {
      booked = availableSeats.slice(0, seatCount).map((seat) => seat.id);
    }

    // Update seats
    const updatedSeats = seats.map((seat) =>
      booked.includes(seat.id) ? { ...seat, isBooked: true } : seat
    );

    setSeats(updatedSeats);
    setBookedSeats(booked);
  };

  return (
    <div className="app">
      <h1>Train Seat Reservation</h1>

      {/* Display seats grouped by rows */}
      <div className="seats-container">
        {Array.from({ length: Math.ceil(TOTAL_SEATS / SEATS_PER_ROW) }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {seats
              .filter((seat) => seat.row === rowIndex + 1)
              .map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
                >
                  {seat.id}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="controls">
        <label>
          Enter number of seats to book:
          <input
            type="number"
            min="1"
            max="7"
            onChange={(e) => bookSeats(Number(e.target.value))}
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {bookedSeats.length > 0 && (
        <div className="booking-info">
          <h3>Seats Booked:</h3>
          <p>{bookedSeats.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default SeatReservation;
