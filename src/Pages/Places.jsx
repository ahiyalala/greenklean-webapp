import React from "react";
import Navigation from "../Components/Navigation";
import { Redirect } from "react-router-dom";
import Data from "../Helpers/Data";
import Sidebar from "../Components/Sidebar";
import PlacesList from "../Components/PlacesList";

export default class Places extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placesList: null
    };
  }

  componentDidMount() {
    Data.getAuthenticatedData("/api/places", (result, data) => {
      if (!result) return;

      this.setState({
        placesList: data
      });
    });
  }

  render() {
    return (
      <div>
        <Navigation path="/booking/places" />
        <div className="container">
          <Sidebar />
          <PlacesList data={this.state.placesList} />
        </div>
      </div>
    );
  }
}
