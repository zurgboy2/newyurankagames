import React from "react";
import "./ReservationForm.css";
import bigTables from "../assets/bigTables.avif";
import smallTables from "../assets/smallTables.avif";
import couchSpaces from "../assets/couchSpaces.avif";
import { makeRegistrationRequestCall } from "../api/api";
import { useState, useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ReservationForm = () => {
  const [error, setError] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [spaces, setSpaces] = useState([]);
  const [bigTablesSelected, setBigTablesSelected] = useState(0);
  const [smallTablesSelected, setSmallTablesSelected] = useState(0);
  const [couchSpacesSelected, setCouchSpacesSelected] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    const today = dayjs().startOf("day");

    if (dayjs(newValue).isBefore(today)) {
      setError("Please select a future date.");
      return;
    }

    setError("");

    setIsLoading(true);
    try {
      const currentTime = new Date();
      const selectedDate = newValue.format("YYYY-MM-DD");

      const slots = await makeRegistrationRequestCall(
        "registration_script",
        "getTimeSlots",
        { date: newValue.format("YYYY-MM-DD") }
      );

      const filteredSlots = slots.filter((slot) => {
        const slotDateTime = new Date(`${selectedDate}T${slot}`);
        return slotDateTime >= currentTime;
      });
      setTimeSlots(filteredSlots);
      setStartTime("");
      setEndTime("");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setIsLoading(false);
    }
  };

  const handleStartTimeChange = (slot) => {
    setStartTime(slot);
    setEndTime("");
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

    const reservationDetails = `Dear ${name},\nYour reservation details are as follows:\n${selectedDate.format(
      "ddd, DD MMM YYYY"
    )} from ${startTime} to ${endTime}\nBig Tables: ${bigTablesSelected}\nSmall Tables: ${smallTablesSelected}\nCouch Spaces: ${couchSpacesSelected}\n\nSubmit reservation and you will be directed to the checkout for payment. Make the payment to confirm your reservation.`;

    setMessage(reservationDetails);
    setIsConfirmationStep(true);
    setShowPopup(true);
  };

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
        window.location.href = response.checkoutUrl;
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
      reservationOptionsRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [spaces]);

  return (
    <div className="reservations-container">
      <h1 className="reservations-title">Reservations Form</h1>

      <div className="reservations-content">
        <div className="reservation-form">
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
                          backgroundColor: "#E5E7EB",
                          color: "#333",
                          border: "1px solid #EC4527", 
                        },
                      },
                      placeholder: "Select a date", 
                    },
                  }}
                />
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </LocalizationProvider>

          {timeSlots.length > 0 && (
            <>
              <div className="reservation-form-group">
                <label>Select Start Time</label>
                <div className="time-grid">
                  {timeSlots.map((slot) => (
                    <Button
                      type="button"
                      variant={startTime === slot ? "default" : "outline"}
                      key={slot}
                      className={`reservationform-time-slot ${
                        startTime === slot ? "selected" : ""
                      }`}
                      onClick={() => handleStartTimeChange(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="reservation-form-group">
                <label>Select End Time</label>
                <div className="time-grid">
                  {timeSlots
                    .filter((slot) => startTime && slot > startTime)
                    .map((slot) => (
                      <Button
                        type="button"
                        variant={endTime === slot ? "default" : "outline"}
                        key={slot}
                        className={`reservationform-time-slot ${
                          endTime === slot ? "selected" : ""
                        }`}
                        onClick={() => handleEndTimeChange(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

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
                <Input
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
                <Input
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
                <Input
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
          <Input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div class="reservation-input-group">
          <label for="email">Email</label>
          <Input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Button size="lg" className="submit-button" onClick={handleReservationSubmit}>
        Submit Reservation
      </Button>

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
        <Button variant="ghost" size="icon" className="close-btn" onClick={onClose}>
          &times;
        </Button>

        <p className="modal-message">
          {message.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>

        {isConfirmationStep && (
          <Button size="lg" className="submit-reservationpage-btn" onClick={onSubmit}>
            Submit Reservation
          </Button>
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
