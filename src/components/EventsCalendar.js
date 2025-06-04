import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './EventsCalendar.css';

const EventsCalendar = ({ tournaments, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const selectedDayRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const daysInMonth = () => {
    const year = currentDate.year();
    const month = currentDate.month();
    const firstDay = moment([year, month, 1]);
    const lastDay = moment(firstDay).endOf('month');
    return { firstDay, lastDay };
  };

  const handleDayClick = (currentDayDate, dayEvents) => {
    if (isMobile && dayEvents.length > 0) {
      setSelectedDay(currentDayDate);
      setTimeout(() => {
        selectedDayRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  // Helper to get the event class based on eventFrequencyType
  const getEventClass = (event) => {
    if (event.eventFrequencyType === 'oneTime') return 'one-time';
    if (event.eventFrequencyType === 'weekly') return 'weekly';
    if (event.eventFrequencyType === 'monthly') return 'monthly';
    // fallback for old data, treat as weekly
    return 'weekly';
  };

  const renderCalendarDays = () => {
    const { firstDay, lastDay } = daysInMonth();
    const days = [];
    const startingDay = firstDay.day();

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.date(); day++) {
      const currentDayDate = moment([currentDate.year(), currentDate.month(), day]);
      const dateString = currentDayDate.format('YYYY-MM-DD');
      
      // Find events for this day
      const dayEvents = tournaments.filter(t => 
        moment(t.date).format('YYYY-MM-DD') === dateString
      );

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${dayEvents.length > 0 ? 'has-events' : ''}`}
          onClick={() => handleDayClick(currentDayDate, dayEvents)}
        >
          <span className="day-number">{day}</span>
          {isMobile ? (
            // Mobile: Show event dots
            dayEvents.length > 0 && (
              <div className="event-indicators">
                {dayEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className={`event-dot ${getEventClass(event)}`} 
                  />
                ))}
              </div>
            )
          ) : (
            // Desktop: Show event names and tooltip
            <div className="individualevents-container">
              {dayEvents.map((event, index) => (
                <div 
                  key={index}
                  className={`event-item ${getEventClass(event)}`}
                >
                  <div className="event-name">{event.name}</div>
                </div>
              ))}
              {dayEvents.length > 0 && (
                <div className="day-tooltip">
                  <div className="tooltip-header">
                    Click on an event to learn more & register!
                  </div>
                  <div className="tooltip-date">
                    {currentDayDate.format('dddd, Do MMMM')}
                  </div>
                  <div className="tooltip-content">
                    {dayEvents.map((event, index) => (
                      <div 
                        key={index} 
                        className={`tooltip-event ${getEventClass(event)}`}
                        onClick={() => onEventClick(event)}
                      >
                        <p className="event-title">{event.name}</p>
                        <p className="event-time">Time: {formatTime(event.date) || "To be informed"}</p>
                        <p className="event-price">Entry: {event.price} EUR</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (increment) => {
    setCurrentDate(moment(currentDate).add(increment, 'months'));
  };

  const renderSelectedDayEvents = () => {
    if (!selectedDay) return null;
  
    const dateString = selectedDay.format('YYYY-MM-DD');
    const dayEvents = tournaments.filter(t => 
      moment(t.date).format('YYYY-MM-DD') === dateString
    );

    return (
      <div ref={selectedDayRef} className="selected-events-wrapper">
        <div className="selected-day-events">
          <div className="selected-day-header">
            Click on an event to learn more & register!
          </div>
          <div className="selected-day-date">
            {selectedDay.format('dddd, Do MMMM')}
          </div>
          <div className="selected-day-content">
            {dayEvents.map((event, index) => (
              <div 
                key={index}
                className={`selected-event ${getEventClass(event)}`}
                onClick={() => onEventClick(event)}
              >
                <p className="event-title">{event.name}</p>
                <p className="event-time">Time: {formatTime(event.date)||"To be informed"}</p>
                <p className="event-price">Entry fee: {event.price} EUR</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="calendar-section">
      <div className="calendar-header">
        <h2 className="calendar-title">Monthly Events Calendar</h2>
        {isMobile ? (
          <div className="mobile-event-types">
            <div className="mobile-event-type">
              <span>One time Events</span>
              <div className="indicator-dot one-time"></div>
            </div>
            <div className="mobile-event-type">
              <span>Weekly Events</span>
              <div className="indicator-dot weekly"></div>
            </div>
            <div className="mobile-event-type">
              <span>Monthly Events</span>
              <div className="indicator-dot monthly"></div>
            </div>
            <div className="mobile-instruction">
              Click on a date to view events!
            </div>
          </div>
        ) : (
          <div className="event-types">
            <span className="event-type weekly">Weekly events</span>
            <span className="event-type one-time">One time event</span>
            <span className="event-type monthly">Monthly event</span>
          </div>
        )}
      </div>

      <div className="month-navigation">
        <FaChevronLeft 
          className="month-nav-icon" 
          onClick={() => changeMonth(-1)}
        />
        <h3 className="current-month">{currentDate.format('MMMM YYYY')}</h3>
        <FaChevronRight 
          className="month-nav-icon" 
          onClick={() => changeMonth(1)}
        />
      </div>

      <div className="calendar-grid">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>
      {isMobile && renderSelectedDayEvents()}
    </div>
  );
};

export default EventsCalendar; 

const formatTime = (isoDate) => {
  if (!isoDate) return null;
  
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return null; // Check for invalid dates

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};