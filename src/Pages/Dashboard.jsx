import React from "react";
import Navigation from "../Components/Navigation";
import Booking from "../Components/Booking";
import Data from "../Helpers/Data";
import Sidebar from "../Components/Sidebar";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isWindowClosed: true,
      selectedAppointment: null,
      appointments: {
        all: [],
        finished: [],
        pending: []
      }
    };
  }

  componentDidMount() {
    Data.getAuthenticatedData("/api/appointments", (result, data) => {
      if (!result) return;

      var needsReview = data.filter(item => item.is_finished == 1);
      var pending = data.filter(item => item.is_finished == 0);
      this.setState({
        appointments: {
          all: data,
          finished: needsReview,
          pending: pending
        }
      });
    });
  }

  handleAppointmentsChange = () => {
    Data.getAuthenticatedData("/api/appointments", (result, data) => {
      if (!result) return;

      var needsReview = data.filter(item => item.is_finished == 1);
      var pending = data.filter(item => item.is_finished == 0);
      this.setState({
        appointments: {
          all: data,
          finished: needsReview,
          pending: pending
        }
      });
    });
  };

  render() {
    return (
      <div>
        <Navigation path="/booking" />
        <div className="container">
          <Sidebar
            submessage={
              "You have " +
              this.state.appointments.pending.length +
              " pending appointments"
            }
          />
          <Booking
            appointments={this.state.appointments}
            onAppointmentsUpdate={this.handleAppointmentsChange}
          />
        </div>
      </div>
    );
  }
}
