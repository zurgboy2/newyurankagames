import React from "react";
import "./ReservationForm.css";
import bigTables from "../assets/bigTables.jpg";
import smallTables from "../assets/smallTables.jpg";
import couchSpaces from "../assets/couchSpaces.jpg";
import { makeRegistrationRequestCall } from "../api/api";
import { useState, useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ReservationForm = () => {
  const [error, setError] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [spaces, setSpaces] = useState([]);
  const [bigTablesSelected, setBigTablesSelected] = useState(0); // Selected big tables
  const [smallTablesSelected, setSmallTablesSelected] = useState(0); // Selected small tables
  const [couchSpacesSelected, setCouchSpacesSelected] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const reservationOptionsRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isConfirmationStep, setIsConfirmationStep] = useState(false);

  useEffect(() => {
    const storedName = sessionStorage.getItem("name") || "";
    setName(storedName);
  }, []);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || "";
    setEmail(storedEmail);
  }, []);

  const handleDateChange = async (newValue) => {
    setTimeSlots("");
    setSelectedDate(dayjs(newValue));
    const today = dayjs().startOf("day"); // Get today's date as a dayjs object for comparison

    // Compare the new date with today's date (ensure both are dayjs objects for proper comparison)
    if (dayjs(newValue).isBefore(today)) {
      setError("Please select a future date.");
      return;
    }

    setError(""); // Clear error if date is valid

    setIsLoading(true);
    try {
      const currentTime = new Date(); // Get current time
      const selectedDate = newValue.format("YYYY-MM-DD");

      const slots = await makeRegistrationRequestCall(
        "registration_script",
        "getTimeSlots",
        { date: newValue.format("YYYY-MM-DD") }
      );
      // Handle slots (e.g., update state)

      const filteredSlots = slots.filter((slot) => {
        const slotDateTime = new Date(`${selectedDate}T${slot}`); // Convert slot to Date object
        return slotDateTime >= currentTime;
      });
      setTimeSlots(filteredSlots);
      setStartTime(""); // Reset selected start time
      setEndTime("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setIsLoading(false);
    }
  };

  const handleStartTimeChange = (slot) => {
    setStartTime(slot);
    setEndTime(""); // Reset end time selection when start time changes
  };

  const handleEndTimeChange = async (slot) => {
    setEndTime(slot);
    setIsLoading(true);

    try {
      const capacities = await makeRegistrationRequestCall(
        "registration_script",
        "checkUnavailability",
        {
          date: selectedDate,
          startTime: startTime,
          endTime: slot,
        }
      );

      setSpaces(capacities);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking unavailability:", error);
    }
  };

  const handleBigTableChange = (e) => {
    const value = Math.max(
      0,
      Math.min(e.target.value, spaces["Big Tables"].count)
    );
    setBigTablesSelected(value);
  };

  const handleSmallTableChange = (e) => {
    const value = Math.max(
      0,
      Math.min(e.target.value, spaces["Small Tables"].count)
    );
    setSmallTablesSelected(value);
  };

  const handleCouchSpaceChange = (e) => {
    const value = Math.max(
      0,
      Math.min(e.target.value, spaces["Couch Spaces"].count)
    );
    setCouchSpacesSelected(value);
  };

  const handleReservationSubmit = async () => {
    // Validation checks

    if (!selectedDate) {
      setMessage("Please select the desired date for your reservation.");
      setCheckoutUrl("");
      setShowPopup(true);
      return;
    }

    if (!startTime || !endTime) {
      setMessage(
        "Please select both start time and end time for your reservation."
      );
      setCheckoutUrl("");
      setShowPopup(true);
      return;
    }

    if (!name || !email) {
      setMessage(
        "Please enter both name and email to proceed with the reservation."
      );
      setCheckoutUrl("");
      setShowPopup(true);
      return;
    }

    if (
      parseInt(bigTablesSelected) === 0 &&
      parseInt(smallTablesSelected) === 0 &&
      parseInt(couchSpacesSelected) === 0
    ) {
      setMessage(
        "Please select at least one reservation option (Big Tables, Small Tables, or Couch Spaces)."
      );
      setCheckoutUrl("");
      setShowPopup(true);
      return;
    }

    // If validation passes, show confirmation popup
    const reservationDetails = `Dear ${name},\nYour reservation details are as follows:\n${selectedDate.format(
      "ddd, DD MMM YYYY"
    )} from ${startTime} to ${endTime}\nBig Tables: ${bigTablesSelected}\nSmall Tables: ${smallTablesSelected}\nCouch Spaces: ${couchSpacesSelected}\n\nSubmit reservation and you will be directed to the checkout for payment. Make the payment to confirm your reservation.`;

    setMessage(reservationDetails);
    setIsConfirmationStep(true); // New state to track if we're showing confirmation
    setShowPopup(true);
  };

  // New function to handle the actual submission
  const handleConfirmedSubmission = async () => {
    var username = sessionStorage.getItem("username");
    var googleToken = sessionStorage.getItem("googleToken");

    var availabilityData = [];
    availabilityData.push(
      { type: "Big Tables", chosenAmount: parseInt(bigTablesSelected) },
      { type: "Small Tables", chosenAmount: parseInt(smallTablesSelected) },
      { type: "Couch Spaces", chosenAmount: parseInt(couchSpacesSelected) }
    );

    const reservationDetails = {
      date: selectedDate.format("YYYY-MM-DD"),
      startTime,
      endTime,
      name,
      email,
      username,
      googleToken,
      availability: availabilityData,
    };

    setIsLoading(true);
    try {
      const response = await makeRegistrationRequestCall(
        "registration_script",
        "submitReservationDetails",
        { reservationDetails }
      );
      setIsLoading(false);

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl; // Direct redirect
      } else {
        setMessage(
          response.message ||
            "An error occurred while processing your reservation."
        );
        setCheckoutUrl("");
        setShowPopup(true);
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
      setMessage(
        "There was a problem submitting your reservation. Please try again."
      );
      setCheckoutUrl("");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (spaces && window.innerWidth >= 768) {
      // Scroll to the reservation options section once spaces are set
      reservationOptionsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [spaces]);

  return (
    <div className="reservations-container">
      {/* Title */}
      <h1 className="reservations-title">Reservations Form</h1>

      <div className="reservations-content">
        {/* Left Side - Reservation Form */}
        <div className="reservation-form">
          {/* Select Date */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="reservation-form-group">
              <label>Select Date</label>
              <div className="input-container">
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      InputProps: {
                        style: {
                          backgroundColor: "#E5E7EB", // White background
                          color: "#333",
                          border: "1px solid #EC4527", // Red border
                        },
                      },
                      placeholder: "Select a date", // Placeholder text
                    },
                  }}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </LocalizationProvider>

          {timeSlots.length > 0 && (
            <>
              {/* Start Time */}
              <div className="reservation-form-group">
                <label>Select Start Time</label>
                <div className="time-grid">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`reservationform-time-slot ${
                        startTime === slot ? "selected" : ""
                      }`}
                      onClick={() => handleStartTimeChange(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* End Time */}
              <div className="reservation-form-group">
                <label>Select End Time</label>
                <div className="time-grid">
                  {timeSlots
                    .filter((slot) => startTime && slot > startTime) // Only show slots after start time
                    .map((slot) => (
                      <button
                        key={slot}
                        className={`reservationform-time-slot ${
                          endTime === slot ? "selected" : ""
                        }`}
                        onClick={() => handleEndTimeChange(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side - Disclaimer Section */}
        <div className="disclaimer-section">
          <h2 className="disclaimer-title">Disclaimer</h2>
          <p>
            You can book any combination of items below. The people limit is
            more of a counter for ourselves, as we might be able to provide a
            discount if you have more than 10 people coming. Though, only
            registering the number of people, and not any spaces, implies that
            you require no seating at the venue and are happy to stand.
          </p>
          <p>
            The reservation fee is charged on the basis of you being able to
            reserve. The amount paid will be deducted from your final bill for
            the total use of the items reserved. Additionally, if you do not
            show up, the reservation fee will not be refunded.
          </p>
          <p>
            You are also allowed to show up at the venue without having
            reserved, but you will not be guaranteed a spot if your requested
            spot is already occupied.
          </p>
        </div>
      </div>

      <div class="reservation-options" ref={reservationOptionsRef}>
        <div class="reservation-card">
          <img src={bigTables} alt="Big Table" />
          <h3>Big Tables</h3>
          <p>
            Space for 6 people to comfortably play any board game, or just hang
            out. TCGs related activities would be playable, but for 4 people.
          </p>
          {spaces && Object.keys(spaces).length > 0 && (
            <>
              <label>
                Available amount:{" "}
                <span class="available-count">
                  {spaces["Big Tables"]?.count}
                </span>
              </label>
              <label class="labelquantitypicker">
                Choose amount:{" "}
                <input
                  type="number"
                  class="quantity-picker"
                  min="0"
                  max={spaces["Big Tables"]?.count}
                  value={bigTablesSelected}
                  onChange={handleBigTableChange}
                />
              </label>
            </>
          )}
        </div>

        <div class="reservation-card">
          <img src={smallTables} alt="Big Table" />
          <h3>Small Tables</h3>
          <p>
            Space for 4 people to comfortably play any board game, or to just
            hang out. TCGs related activities would be playable, but for 2
            people.
          </p>
          {spaces && Object.keys(spaces).length > 0 && (
            <>
              <label>
                Available amount:{" "}
                <span class="available-count">
                  {spaces["Small Tables"]?.count}
                </span>
              </label>
              <label class="labelquantitypicker">
                Choose amount:{" "}
                <input
                  type="number"
                  class="quantity-picker"
                  min="0"
                  max={spaces["Small Tables"]?.count}
                  value={smallTablesSelected}
                  onChange={handleSmallTableChange}
                />
              </label>
            </>
          )}
        </div>

        <div class="reservation-card">
          <img src={couchSpaces} alt="Big Table" />
          <h3>Couch Spaces</h3>
          <p>
            Comfortable seating for 6 people. Often accompanied by various video
            games.
          </p>
          {spaces && Object.keys(spaces).length > 0 && (
            <>
              <label>
                Available amount:{" "}
                <span class="available-count">
                  {spaces["Couch Spaces"]?.count}
                </span>
              </label>
              <label class="labelquantitypicker">
                Choose amount:{" "}
                <input
                  type="number"
                  class="quantity-picker"
                  min="0"
                  max={spaces["Couch Spaces"]?.count}
                  value={couchSpacesSelected}
                  onChange={handleCouchSpaceChange}
                />
              </label>
            </>
          )}
        </div>
      </div>

      <div class="reservation-form2">
        <div class="reservation-input-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div class="reservation-input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <button className="submit-button" onClick={handleReservationSubmit}>
        Submit Reservation
      </button>

      {showPopup && (
        <ConfirmationPopup
          message={message}
          isConfirmationStep={isConfirmationStep}
          onClose={() => {
            setShowPopup(false);
            setIsConfirmationStep(false);
          }}
          onSubmit={handleConfirmedSubmission}
        />
      )}
      <LoadingModal isLoading={isLoading} />
    </div>
  );
};

const ConfirmationPopup = ({
  message,
  isConfirmationStep,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <p className="modal-message">
          {message.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        {isConfirmationStep && (
          <button className="submit-reservationpage-btn" onClick={onSubmit}>
            Submit Reservation
          </button>
        )}
      </div>
    </div>
  );
};

const LoadingModal = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="modal-overlay">
        <div className="resevations-modal-content">
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-message">Loading...</p>
          </div>
        </div>
      </div>
    )
  );
};

export default ReservationForm;
