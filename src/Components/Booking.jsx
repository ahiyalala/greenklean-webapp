import React from "react";
import Data from "../Helpers/Data";

export default class Booking extends React.Component {
  constructor(props) {
    super(props);

    //Refs
    this.serviceTypeId = React.createRef();

    //States
    this.state = {
      isWindowClosed: true,
      isBookingClosed: false,
      selectedAppointment: null,
      services: []
    };
  }

  componentDidMount() {
    Data.getData("/api/services", (result, data) => {
      if (!result) return;

      this.setState({
        services: data
      });
    });
  }

  toggleWindow = e => {
    this.setState(prevState => {
      return {
        isWindowClosed: !prevState.isWindowClosed,
        selectedAppointment: null
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
        isBookingClosed: !prevState.isWindowClosed
      };
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

  renderBooking() {
    if (this.state.isBookingClosed) return;

    return (
      <div className="booking-scheduler__backdrop">
        <div className="booking-scheduler__container">
          <div className="booking-scheduler__header">
            <h4>Book a service</h4>
          </div>
          <div className="booking-scheduler__body">
            <div className="booking-scheduler__field">
              <label>
                Service
                <select ref={this.serviceTypeId}>
                  {this.state.services.map((value, index) => {
                    return (
                      <option value={value.service_type_key} key={index}>
                        {value.service_type_key}
                      </option>
                    );
                  })}
                </select>
              </label>
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
