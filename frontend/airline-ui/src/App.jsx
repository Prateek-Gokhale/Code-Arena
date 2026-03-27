import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./api";

const initialSearch = {
  origin: "",
  destination: "",
  date: ""
};

const initialBooking = {
  passengerName: "",
  passengerEmail: "",
  passengerPhone: "",
  seats: 1
};

const initialFlight = {
  flightNumber: "",
  airline: "",
  origin: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  basePrice: "",
  totalSeats: ""
};

function App() {
  const [search, setSearch] = useState(initialSearch);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [booking, setBooking] = useState(initialBooking);
  const [bookingResult, setBookingResult] = useState(null);
  const [createFlight, setCreateFlight] = useState(initialFlight);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    loadFlights();
  }, []);

  async function loadFlights(customSearch) {
    const querySource = customSearch || search;
    const params = new URLSearchParams();

    if (querySource.origin) params.set("origin", querySource.origin.toUpperCase());
    if (querySource.destination) params.set("destination", querySource.destination.toUpperCase());
    if (querySource.date) params.set("date", querySource.date);

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest(`/flights${params.toString() ? `?${params.toString()}` : ""}`);
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchChange(event) {
    const { name, value } = event.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    await loadFlights(search);
  }

  function handleBookingChange(event) {
    const { name, value } = event.target;
    setBooking((prev) => ({ ...prev, [name]: name === "seats" ? Number(value) : value }));
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();
    if (!selectedFlight) return;

    setActionMessage("");

    try {
      const data = await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify({
          flightId: selectedFlight.id,
          passengerName: booking.passengerName,
          passengerEmail: booking.passengerEmail,
          passengerPhone: booking.passengerPhone,
          seats: booking.seats
        })
      });
      setBookingResult(data);
      setBooking(initialBooking);
      setSelectedFlight(null);
      setActionMessage("Booking created successfully.");
      await loadFlights();
    } catch (err) {
      setActionMessage(err.message);
    }
  }

  function handleCreateFlightChange(event) {
    const { name, value } = event.target;
    setCreateFlight((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreateFlightSubmit(event) {
    event.preventDefault();
    setActionMessage("");

    try {
      await apiRequest("/flights", {
        method: "POST",
        body: JSON.stringify({
          ...createFlight,
          departureTime: normalizeLocalDateTime(createFlight.departureTime),
          arrivalTime: normalizeLocalDateTime(createFlight.arrivalTime),
          basePrice: Number(createFlight.basePrice),
          totalSeats: Number(createFlight.totalSeats)
        })
      });
      setCreateFlight(initialFlight);
      setActionMessage("Flight added.");
      await loadFlights();
    } catch (err) {
      setActionMessage(err.message);
    }
  }

  const selectedPrice = useMemo(() => {
    if (!selectedFlight) return 0;
    return Number(selectedFlight.basePrice || 0) * Number(booking.seats || 0);
  }, [selectedFlight, booking.seats]);

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Java Full Stack | Microservices | React</p>
        <h1>Airline Ticket Booking Platform</h1>
        <p>
          Search flights, reserve seats, and manage bookings using Spring Boot + Hibernate services behind an API gateway.
        </p>
      </header>

      <section className="card">
        <h2>Search Flights</h2>
        <form className="grid-form" onSubmit={handleSearchSubmit}>
          <label>
            Origin
            <input
              name="origin"
              placeholder="DEL"
              value={search.origin}
              onChange={handleSearchChange}
            />
          </label>
          <label>
            Destination
            <input
              name="destination"
              placeholder="BOM"
              value={search.destination}
              onChange={handleSearchChange}
            />
          </label>
          <label>
            Date
            <input type="date" name="date" value={search.date} onChange={handleSearchChange} />
          </label>
          <button type="submit">Find Flights</button>
        </form>
        {error && <p className="message error">{error}</p>}
      </section>

      <section className="card">
        <h2>Available Flights</h2>
        {loading ? (
          <p>Loading flights...</p>
        ) : flights.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>
                      <strong>{flight.flightNumber}</strong>
                      <br />
                      {flight.airline}
                    </td>
                    <td>
                      {flight.origin} to {flight.destination}
                    </td>
                    <td>{formatDateTime(flight.departureTime)}</td>
                    <td>INR {Number(flight.basePrice).toLocaleString()}</td>
                    <td>{flight.availableSeats}</td>
                    <td>
                      <button
                        type="button"
                        disabled={flight.availableSeats < 1}
                        onClick={() => {
                          setSelectedFlight(flight);
                          setBookingResult(null);
                          setActionMessage("");
                        }}
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedFlight && (
        <section className="card">
          <h2>Book Flight {selectedFlight.flightNumber}</h2>
          <form className="grid-form" onSubmit={handleBookingSubmit}>
            <label>
              Passenger Name
              <input name="passengerName" value={booking.passengerName} onChange={handleBookingChange} required />
            </label>
            <label>
              Passenger Email
              <input
                name="passengerEmail"
                type="email"
                value={booking.passengerEmail}
                onChange={handleBookingChange}
                required
              />
            </label>
            <label>
              Passenger Phone
              <input name="passengerPhone" value={booking.passengerPhone} onChange={handleBookingChange} required />
            </label>
            <label>
              Seats
              <input
                name="seats"
                type="number"
                min="1"
                max={selectedFlight.availableSeats}
                value={booking.seats}
                onChange={handleBookingChange}
                required
              />
            </label>
            <div className="booking-summary">Estimated Fare: INR {selectedPrice.toLocaleString()}</div>
            <button type="submit">Confirm Booking</button>
          </form>
        </section>
      )}

      {bookingResult && (
        <section className="card success">
          <h2>Booking Confirmed</h2>
          <p>Reference: {bookingResult.bookingReference}</p>
          <p>
            Flight: {bookingResult.flightNumber} ({bookingResult.origin} to {bookingResult.destination})
          </p>
          <p>Total Fare: INR {Number(bookingResult.totalAmount).toLocaleString()}</p>
        </section>
      )}

      <section className="card">
        <h2>Add Flight (Admin)</h2>
        <form className="grid-form" onSubmit={handleCreateFlightSubmit}>
          <label>
            Flight Number
            <input name="flightNumber" value={createFlight.flightNumber} onChange={handleCreateFlightChange} required />
          </label>
          <label>
            Airline
            <input name="airline" value={createFlight.airline} onChange={handleCreateFlightChange} required />
          </label>
          <label>
            Origin
            <input name="origin" value={createFlight.origin} onChange={handleCreateFlightChange} required />
          </label>
          <label>
            Destination
            <input name="destination" value={createFlight.destination} onChange={handleCreateFlightChange} required />
          </label>
          <label>
            Departure Time
            <input
              type="datetime-local"
              name="departureTime"
              value={createFlight.departureTime}
              onChange={handleCreateFlightChange}
              required
            />
          </label>
          <label>
            Arrival Time
            <input
              type="datetime-local"
              name="arrivalTime"
              value={createFlight.arrivalTime}
              onChange={handleCreateFlightChange}
              required
            />
          </label>
          <label>
            Base Price
            <input
              type="number"
              step="0.01"
              min="1"
              name="basePrice"
              value={createFlight.basePrice}
              onChange={handleCreateFlightChange}
              required
            />
          </label>
          <label>
            Total Seats
            <input
              type="number"
              min="1"
              name="totalSeats"
              value={createFlight.totalSeats}
              onChange={handleCreateFlightChange}
              required
            />
          </label>
          <button type="submit">Add Flight</button>
        </form>
      </section>

      {actionMessage && <p className="message">{actionMessage}</p>}
    </div>
  );
}

function normalizeLocalDateTime(value) {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export default App;
