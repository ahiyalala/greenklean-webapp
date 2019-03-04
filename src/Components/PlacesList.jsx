import React from "react";
import Data from "../Helpers/Data";

export default class PlacesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWindowOpen: false
    };
  }
  renderList = data => {
    if (data == null) {
      return (
        <div className="no-place">
          <strong className="no-place-text">Loading...</strong>
        </div>
      );
    }
    if (data.length == 0) {
      return (
        <div className="no-place">
          <strong className="no-place-text">
            You haven't added your place yet.
          </strong>
          <a className="btn">Add here</a>
        </div>
      );
    }

    return data.map((value, index) => {
      return (
        <div className="booking-block" key={index}>
          <div className="booking-block__section">
            <strong className="booking-description">
              {value.location_street +
                ", " +
                value.location_barangay +
                " " +
                value.location_city}
            </strong>
            <small className="booking-description">{value.location_type}</small>
          </div>
        </div>
      );
    });
  };

  renderButton = data => {
    if (data == null) return;
    if (data.length > 0) {
      return (
        <a
          className="booking-header__scheduler"
          href="javascript:void(0);"
          onClick={e => this.toggleWindow(e)}
        >
          Add new place
        </a>
      );
    }

    return;
  };

  toggleWindow = () => {
    this.setState(prevState => {
      var prevBool = !prevState.isWindowOpen;
      return {
        isWindowOpen: prevBool
      };
    });
  };

  renderForm = () => {
    if (!this.state.isWindowOpen) return;

    return (
      <div className="booking-details__backdrop">
        <div className="booking-details">
          <div className="booking-details__header">
            <a
              className="booking-details__close"
              onClick={e => this.toggleWindow(e)}
            >
              &times;
            </a>
            <h4 className="booking-details__service-type">Add your place</h4>
          </div>
          <div className="booking-details__content">
            <span>Test</span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="booking-container">
        <h2 className="booking-header">
          My places
          {this.renderButton(this.props.data)}
        </h2>
        <hr />
        <div className="booking-list">{this.renderList(this.props.data)}</div>
        {this.renderForm()}
      </div>
    );
  }
}
