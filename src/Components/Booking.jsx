import React from "react";
import Data from "../Helpers/Data";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";

import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

export default class Booking extends React.Component {
  constructor(props) {
    super(props);

    this.moment = moment();
    var customer = JSON.parse(localStorage.getItem("credentials"));
    this.customer_id = customer.customer_id;
    this.cancelTick = null;
    //States
    this.state = {
      isWindowClosed: true,
      isBookingClosed: true,
      selectedAppointment: null,
      isSendingData: false,
      cancelTimer: 5,
      services: [],
      location: [],
      bookingDetails: {
        service: {}
      },
      windows: {
        service: false,
        location: false,
        housekeepers: false
      },
      bookingDisplay: {
        service: null,
        location: null,
        number_of_housekeepers: 1,
        date: this.addDays(new Date(), 7),
        time: new Date(0, 0, 0, 7)
      },
      bookingForm: {
        service_type_key: null,
        customer_id: this.customer_id,
        location_id: null,
        payment_type: "Cash",
        date: moment(this.addDays(new Date(), 7)).format("YYYY-MM-DD"),
        start_time: moment(new Date(0, 0, 0, 7)).format("H:mm"),
        number_of_housekeepers: 1
      }
    };
  }

  sendAppointmentData = e => {
    var content = this.state.bookingForm;
    if (!window.confirm("Proceed with booking?")) {
      return;
    }
    if (!this.isValidForm()) return;

    this.setState({
      isSendingData: true
    });

    Data.sendAuthenticatedData("/api/appointments", content, data => {
      if (data.message != null) {
        alert(data.message);
        this.setState({
          isSendingData: false
        });
        return;
      }
      this.props.onAppointmentsUpdate();
      this.setState({
        isSendingData: false,
        selectedAppointment: data,
        isWindowClosed: false,
        isBookingClosed: true,
        windows: {
          service: false,
          location: false,
          housekeepers: false
        },
        bookingDisplay: {
          service: null,
          location: null,
          number_of_housekeepers: 1,
          date: this.addDays(new Date(), 7),
          time: new Date(0, 0, 0, 7)
        },
        bookingForm: {
          service_type_key: null,
          customer_id: this.customer_id,
          location_id: null,
          payment_type: "Cash",
          date: moment(this.addDays(new Date(), 7)).format("YYYY-MM-DD"),
          start_time: moment(new Date(0, 0, 0, 7)).format("H:mm"),
          number_of_housekeepers: 1
        }
      });
    });
  };

  componentDidMount() {
    Data.getData("/api/services", (result, data) => {
      if (!result) return;

      this.setState({
        services: data
      });
    });

    Data.getAuthenticatedData("/api/places", (result, data) => {
      if (!result) return;

      this.setState({
        location: data
      });
    });
  }

  isValidForm = () => {
    var _service = this.state.bookingForm.service_type_key;
    var _location = this.state.bookingForm.location_id;

    return _service && _location;
  };

  addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  };

  handleTimeChange = value => {
    var timeOnly = moment(value).format("H:mm");
    this.setState(prevState => {
      prevState.bookingDisplay.time = value;
      prevState.bookingForm.start_time = timeOnly;

      return prevState;
    });
  };

  handleDateChange = dateValue => {
    this.setState(prevState => {
      prevState.bookingDisplay.date = dateValue;
      prevState.bookingForm.date = moment(dateValue).format("YYYY-MM-DD");

      return prevState;
    });
  };

  toggleDropdown = (key, e) => {
    var _windows = {
      service: false,
      location: false
    };

    _windows[key] = !this.state.windows[key];

    this.setState({
      windows: _windows
    });
  };

  toDisplayDropdown(state) {
    if (state) return "block";

    return "none";
  }

  toggleWindow = e => {
    this.setState(prevState => {
      return {
        isWindowClosed: !prevState.isWindowClosed,
        selectedAppointment: null
      };
    });
  };

  toggleScheduler = e => {
    this.setState(prevState => {
      return {
        isBookingClosed: !prevState.isBookingClosed
      };
    });
  };

  openWindow = (e, id) => {
    var appointment = this.props.appointments.all.filter(
      item => item.service_cleaning_id == id
    )[0];
    this.setState(prevState => {
      return {
        isWindowClosed: !prevState.isWindowClosed,
        selectedAppointment: appointment
      };
    });
  };

  openBooking = e => {
    this.setState(prevState => {
      return {
        isBookingClosed: !prevState.isBookingClosed
      };
    });
  };

  setService = (value, e) => {
    this.setState(function(prevState) {
      prevState.bookingForm.service_type_key = value.service_type_key;
      prevState.bookingDisplay.service = value.service_type_key;
      prevState.windows.service = false;
      return prevState;
    });
  };

  setLocation = (value, e) => {
    this.setState(function(prevState) {
      prevState.bookingForm.location_id = value.location_id;
      prevState.bookingDisplay.location =
        value.location_street +
        " " +
        value.location_barangay +
        ", " +
        value.location_city;
      prevState.windows.location = false;

      return prevState;
    });
  };

  setHouseKeepers = (value, e) => {
    this.setState(function(prevState) {
      prevState.bookingForm.number_of_housekeepers = value;
      prevState.bookingDisplay.number_of_housekeepers = value;
      prevState.windows.housekeepers = false;

      return prevState;
    });
  };

  renderStars(rating) {
    if (rating == 0) {
      return (
        <span className="booking-details__rating--no-rating">
          No rating yet
        </span>
      );
    }
    var stars = [];
    var ceiling = Math.ceil(rating);
    var floor = Math.floor(rating);
    for (var x = 0; x < floor; x++) {
      stars.push("1");
    }
    if (floor < ceiling) {
      stars.push("0");
    }

    stars.map((value, index) => {
      var star = value ? "la-star" : "la-star-half";

      return <i key={index} className={"la " + star} />;
    });
  }

  renderDetails() {
    if (!this.state.selectedAppointment) return;

    return (
      <div
        className="booking-details__backdrop"
        style={{ display: this.state.isWindowClosed ? "none" : "" }}
      >
        <div className="booking-details">
          <div className="booking-details__header">
            <a
              className="booking-details__close"
              onClick={e => this.toggleWindow(e)}
            >
              &times;
            </a>
            <small className="booking-details__subtext">
              Appointment details
            </small>
            <h4 className="booking-details__service-type">
              {this.state.selectedAppointment.service.service_type_key}
            </h4>
            <span className="booking-details__data">
              Date:{" "}
              <span className="booking-details__value">
                {this.state.selectedAppointment.date}
              </span>
            </span>
            <span className="booking-details__data">
              Price:{" "}
              <span className="booking-details__value">
                PHP{this.state.selectedAppointment.total_price}
              </span>
            </span>
          </div>
          <div className="booking-details__content">
            <small className="booking-details__subtext">
              Housekeepers ({this.state.selectedAppointment.housekeepers.length}
              )
            </small>
            <ul className="booking-details__housekeepers">
              {this.state.selectedAppointment.housekeepers.map(
                (value, index) => {
                  return (
                    <li className="booking-details__housekeeper" key={index}>
                      {value.last_name +
                        ", " +
                        value.first_name +
                        " " +
                        value.middle_name.substring(0, 1) +
                        "."}
                      <span className="booking-details__rating">
                        {this.renderStars(value.rating)}
                      </span>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
          {this.bookingCancellable(this.state.selectedAppointment)}
        </div>
      </div>
    );
  }

  bookingCancellable = appointment => {
    var today = moment();
    var appointmentDate = moment(appointment.date);
    var difference = appointmentDate.diff(today, "days");
    if (difference > 1) {
      return (
        <a
          className="booking-details__cancel"
          onClick={e =>
            this.cancelAppointment(e, appointment.service_cleaning_id)
          }
        >
          <span>Cancel booking</span>
        </a>
      );
    }

    return;
  };

  cancelAppointment = (e, service_id) => {
    var willProceed = window.confirm("Do you want to cancel your booking?");
    if (willProceed) {
      Data.deleteAuthenticatedData(
        "/api/appointments/cancel/" + service_id,
        result => {
          if (result) {
            this.props.onAppointmentsUpdate();
          } else {
            window.alert("We can't process your request");
          }

          this.setState({
            isWindowClosed: true,
            isBookingClosed: true,
            selectedAppointment: null
          });
          return;
        }
      );
    }
  };

  renderValue(data, nullMessage) {
    if (data) return data;

    return nullMessage;
  }

  renderBooking() {
    if (this.state.isBookingClosed) return;

    return (
      <div className="booking-scheduler__backdrop">
        <div className="booking-scheduler__container">
          <div className="booking-scheduler__header">
            <a
              className="booking-details__close"
              onClick={e => this.toggleScheduler(e)}
            >
              &times;
            </a>
            <h4 className="booking-details__service-type">Book a service</h4>
          </div>
          <div className="booking-scheduler__body">
            <div
              className="booking-scheduler__field"
              style={{
                pointerEvents: this.state.isSendingData ? "none" : "auto"
              }}
            >
              <div className="booking-scheduler__input">
                <div
                  className="booking-scheduler__selected"
                  onClick={e => this.toggleDropdown("service", e)}
                >
                  <small className="booking-scheduler__title">Service</small>
                  <span className="booking-scheduler__value">
                    {this.renderValue(
                      this.state.bookingDisplay.service,
                      "Select a booking"
                    )}
                  </span>
                </div>
                <ul
                  className="booking-scheduler__options"
                  style={{
                    display: this.toDisplayDropdown(this.state.windows.service)
                  }}
                >
                  {this.state.services.map((value, index) => {
                    return (
                      <li
                        className="booking-scheduler__option"
                        key={index}
                        onClick={e => this.setService(value, e)}
                      >
                        <span className="booking-scheduler__value">
                          {value.service_type_key}
                        </span>
                        <small className="booking-scheduler__title">
                          {"Starts at PHP" + value.service_price}
                        </small>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="booking-scheduler__input">
                <div className="booking-scheduler__selected">
                  <small className="booking-scheduler__title">Payment</small>
                  <span className="booking-scheduler__value">
                    Cash{" "}
                    <small className="booking-scheduler__subtext">
                      (more methods coming soon!)
                    </small>
                  </span>
                </div>
              </div>
              <div className="booking-scheduler__input">
                <div
                  className="booking-scheduler__selected"
                  onClick={e => this.toggleDropdown("location", e)}
                >
                  <small className="booking-scheduler__title">Location</small>
                  <span className="booking-scheduler__value">
                    {this.renderValue(
                      this.state.bookingDisplay.location,
                      this.state.location.length > 0
                        ? "Select location"
                        : "No location added yet"
                    )}
                  </span>
                </div>
                <ul
                  className="booking-scheduler__options"
                  style={{
                    display: this.toDisplayDropdown(this.state.windows.location)
                  }}
                >
                  {this.state.location.map((value, index) => {
                    return (
                      <li
                        className="booking-scheduler__option"
                        key={index}
                        onClick={e => this.setLocation(value, e)}
                      >
                        <span className="booking-scheduler__value">
                          {value.location_street +
                            " " +
                            value.location_barangay +
                            ", " +
                            value.location_city}
                        </span>
                        <small className="booking-scheduler__title">
                          {value.location_type}
                        </small>
                      </li>
                    );
                  })}
                  <li className="booking-scheduler__option booking-scheduler__option--light">
                    <Link to="/places" className="booking-scheduler__add">
                      <i className="la la-plus-circle booking-scheduler__add-icon" />
                      <span className="booking-scheduler__add-text">
                        Add a place
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div
                className="booking-scheduler__input"
                style={{
                  display: this.toDisplayDropdown(
                    this.state.bookingDisplay.service
                  )
                }}
              >
                <div
                  className="booking-scheduler__selected"
                  onClick={e => this.toggleDropdown("housekeepers", e)}
                >
                  <small className="booking-scheduler__title">
                    Housekeepers
                  </small>
                  <span className="booking-scheduler__value">
                    {this.renderValue(
                      this.state.bookingDisplay.number_of_housekeepers,
                      "Invalid"
                    )}
                  </span>
                </div>
                <ul
                  className="booking-scheduler__options"
                  style={{
                    display: this.toDisplayDropdown(
                      this.state.windows.housekeepers
                    )
                  }}
                >
                  {[1, 2, 3, 4, 5].map((value, index) => {
                    return (
                      <li
                        className="booking-scheduler__option"
                        key={index}
                        onClick={e => this.setHouseKeepers(value, e)}
                      >
                        <span className="booking-scheduler__value">
                          {value}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="booking-scheduler__input-group">
                <div
                  className="booking-scheduler__input"
                  style={{
                    display: this.toDisplayDropdown(
                      this.state.bookingDisplay.service
                    )
                  }}
                >
                  <small className="booking-scheduler__title">
                    Date and Time
                  </small>
                  <DatePicker
                    className="booking-scheduler__datepicker"
                    selected={this.state.bookingDisplay.date}
                    onChange={this.handleDateChange}
                    dateFormat="MMMM d, yyyy"
                    minDate={this.addDays(new Date(), 7)}
                    maxDate={this.addDays(this.addDays(new Date(), 7), 90)}
                  />
                  <DatePicker
                    selected={this.state.bookingDisplay.time}
                    onChange={this.handleTimeChange}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={60}
                    dateFormat="h:mm aa"
                    minTime={new Date(0, 0, 0, 7)}
                    maxTime={new Date(0, 0, 0, 19)}
                  />
                </div>
              </div>
              <div
                className={
                  !this.isValidForm() || this.state.isSendingData
                    ? "booking-scheduler__book-btn booking-scheduler__book-btn--disabled"
                    : "booking-scheduler__book-btn"
                }
                onClick={e => this.sendAppointmentData(e)}
              >
                <span>Set an appointment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="booking-container">
        <h2 className="booking-header">
          My appointments
          <a
            className="booking-header__scheduler"
            href="javascript:void(0);"
            onClick={e => this.openBooking(e)}
          >
            Book now
          </a>
        </h2>
        <small className="booking-category">
          <strong>Pending</strong>
        </small>
        <div className="booking-list">
          {this.props.appointments.pending.map((value, index) => {
            return (
              <div
                className="booking-block booking-block--cursor"
                onClick={e => this.openWindow(e, value.service_cleaning_id)}
                key={index}
              >
                <div className="booking-block__section">
                  <strong className="booking-description">
                    {value.service.service_type_key},{" "}
                    {value.housekeepers.length} cleaners
                  </strong>
                  <small className="booking-description">
                    {value.date} {value.start_time}
                  </small>
                </div>
                <div className="booking-block__section booking-block--right">
                  <strong className="booking-description">
                    PHP{value.total_price}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
        {this.renderDetails()}
        {this.renderBooking()}
      </div>
    );
  }
}
