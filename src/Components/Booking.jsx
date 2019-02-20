import React from "react";
import Data from "../Helpers/Data";
import { Link } from "react-router-dom";

export default class Booking extends React.Component {
  constructor(props) {
    super(props);

    var customer = localStorage.getItem("credentials");
    //States
    this.state = {
      isWindowClosed: true,
      isBookingClosed: true,
      selectedAppointment: null,
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
        number_of_housekeepers: 1
      },
      bookingForm: {
        service_type_key: null,
        customer_id: customer.customer_id,
        location_id: null,
        payment_type: "Cash",
        date: null,
        start_time: null,
        number_of_housekeepers: 1
      }
    };
  }

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

      return <i class={"la " + star} />;
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
              class="booking-details__close"
              onClick={e => this.toggleWindow(e)}
            >
              &times;
            </a>
            <small className="booking-details__subtext">
              Appointment details
            </small>
            <h4 className="booking-details__service-type">Express Cleaning</h4>
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
                    <li className="booking-details__housekeeper">
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
          <a className="booking-details__cancel">
            <span>Cancel booking</span>
          </a>
        </div>
      </div>
    );
  }

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
              class="booking-details__close"
              onClick={e => this.toggleScheduler(e)}
            >
              &times;
            </a>
            <h4 className="booking-details__service-type">Book a service</h4>
          </div>
          <div className="booking-scheduler__body">
            <div className="booking-scheduler__field">
              <div class="booking-scheduler__input">
                <div
                  class="booking-scheduler__selected"
                  onClick={e => this.toggleDropdown("service", e)}
                >
                  <small class="booking-scheduler__title">Service</small>
                  <span class="booking-scheduler__value">
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
                        <small class="booking-scheduler__title">
                          {"Starts at PHP" + value.service_price}
                        </small>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div class="booking-scheduler__input">
                <div class="booking-scheduler__selected">
                  <small class="booking-scheduler__title">Payment</small>
                  <span class="booking-scheduler__value">
                    Cash{" "}
                    <small className="booking-scheduler__subtext">
                      (more methods coming soon!)
                    </small>
                  </span>
                </div>
              </div>
              <div class="booking-scheduler__input">
                <div
                  class="booking-scheduler__selected"
                  onClick={e => this.toggleDropdown("location", e)}
                >
                  <small class="booking-scheduler__title">Location</small>
                  <span class="booking-scheduler__value">
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
                        <small class="booking-scheduler__title">
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
                class="booking-scheduler__input"
                style={{
                  display: this.toDisplayDropdown(
                    this.state.bookingDisplay.service
                  )
                }}
              >
                <div
                  class="booking-scheduler__selected"
                  onClick={e => this.toggleDropdown("housekeepers", e)}
                >
                  <small class="booking-scheduler__title">Housekeepers</small>
                  <span class="booking-scheduler__value">
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
            </div>
          </div>
          <div
            class="booking-scheduler__input"
            style={{
              display: this.toDisplayDropdown(this.state.bookingDisplay.service)
            }}
          />
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
                className="booking-block"
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
