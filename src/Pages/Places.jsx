import React from "react";
import Navigation from "../Components/Navigation";
import Booking from "../Components/Booking";
import { Redirect } from "react-router-dom";
import Data from "../Helpers/Data";
import Sidebar from "../Components/Sidebar";

export default class Places extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navigation />
        <div className="container">
          <Sidebar />
        </div>
      </div>
    );
  }
}
