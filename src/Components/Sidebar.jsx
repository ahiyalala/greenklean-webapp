import React from "react";
import Navigation from "../Components/Navigation";
import Booking from "../Components/Booking";
import { Redirect } from "react-router-dom";
import Data from "../Helpers/Data";

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.logoutEl = React.createRef();
    this.state = {
      hasLoggedOut: false,
      user: null
    };
  }

  logoutEvent = e => {
    if(!window.confirm("Are you sure you want to log out?")) return;

    localStorage.removeItem("credentials");
    this.setState({ hasLoggedOut: true });
  };

  componentDidMount() {
    //Profile
    var profile = JSON.parse(localStorage.getItem("credentials"));

    this.setState({
      user: {
        firstName: profile.first_name,
        lastName: profile.last_name,
        middleName: profile.middle_name,
        email: profile.email_address,
        gender: profile.gender,
        contactNumber: profile.contact_number,
        birthDate: profile.birth_date
      }
    });
  }

  render() {
    if (this.state.hasLoggedOut) return <Redirect to="/login" />;

    return (
      <div className="profile-sidebar">
        <h4>
          Hello, {this.state.user ? this.state.user.firstName : "Customer"}
        </h4>
        <hr />
        <div className="dashboard-details">
          <p className="subdetails">{this.props.submessage}</p>
        </div>
        <a
          href="javascript:void(0)"
          onClick={this.logoutEvent}
          className="logout-button"
        >
          Logout
        </a>
      </div>
    );
  }
}
