import React from "react";
import Data from "../Helpers/Data";

export default class PlacesList extends React.Component {
  constructor(props) {
    super(props);
    var customer = JSON.parse(localStorage.getItem("credentials"));
    this.customer_id = customer.customer_id;

    this.state = {
      isWindowOpen: false,
      placesOptions: [],
      isSendingData: false,
      placesForm: {
        location_type: null,
        location_street: null,
        location_city: null,
        location_barangay: null,
        customer_id: this.customer_id
      },
      placesValidity: {
        location_type: 0,
        location_street: 0,
        location_city: 0,
        location_barangay: 0
      }
    };

    this.placeName = React.createRef();
    this.streetName = React.createRef();
    this.barangayName = React.createRef();
    this.cityName = React.createRef();
  }

  componentDidMount() {
    Data.getAuthenticatedData("/api/places/locations-list", (result, data) => {
      if (!result) return;
      this.setState({
        placesOptions: data
      });
    });
  }

  renderList = () => {
    var data = this.props.data;
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
            <div className="form-row nowrap">
              <label className="form-label form-label--full">
                Name
                <input
                  type="email"
                  className={
                    "form-field " +
                    this.formValid(this.state.placesValidity.location_type)
                  }
                  ref={this.placeName}
                  onBlur={e =>
                    this.checkIfNull(e, "location_type", this.placeName)
                  }
                />
              </label>
            </div>
            <div className="form-row nowrap">
              <label className="form-label form-label--full">
                Street
                <input
                  type="email"
                  className={
                    "form-field " +
                    this.formValid(this.state.placesValidity.location_street)
                  }
                  ref={this.streetName}
                  onBlur={e =>
                    this.checkIfNull(e, "location_street", this.streetName)
                  }
                />
              </label>
            </div>
            <div className="form-row nowrap">
              <label className="form-label form-label--full">
                Street
                <select
                  type="email"
                  className={
                    "form-field " +
                    this.formValid(this.state.placesValidity.location_city)
                  }
                  ref={this.cityName}
                  onBlur={e =>
                    this.checkIfNull(e, "location_city", this.cityName)
                  }
                  onChange={e => this.setValue("location_city", this.cityName)}
                >
                  <option />
                  {this.renderCityList()}
                </select>
              </label>
            </div>
            <div className="form-row nowrap">
              <label className="form-label form-label--full">
                Street
                <select
                  type="email"
                  className={
                    "form-field " +
                    this.formValid(this.state.placesValidity.location_barangay)
                  }
                  ref={this.barangayName}
                  onBlur={e =>
                    this.checkIfNull(e, "location_barangay", this.barangayName)
                  }
                  onChange={e =>
                    this.setValue("location_barangay", this.barangayName)
                  }
                >
                  <option />
                  {this.renderBarangay()}
                </select>
              </label>
            </div>

            <div
              className={
                this.canThisSignUp() || this.state.isSendingData
                  ? "booking-scheduler__book-btn"
                  : "booking-scheduler__book-btn booking-scheduler__book-btn--disabled"
              }
              onClick={e => this.submitForm(e)}
            >
              Submit
            </div>
          </div>
        </div>
      </div>
    );
  };

  submitForm = e => {
    if (!this.canThisSignUp()) return;

    var content = this.state.placesForm;
    this.setState({
      isSendingData: true
    });

    Data.sendAuthenticatedData("/api/places", content, data => {
      if (data.message != null) {
        alert(data.message);
        this.setState({
          isSendingData: false
        });
        return;
      }
      this.props.onListUpdate();
      this.setState({
        isWindowOpen: false,
        isSendingData: false,
        placesForm: {
          location_type: null,
          location_street: null,
          location_city: null,
          location_barangay: null,
          customer_id: this.customer_id
        },
        placesValidity: {
          location_type: 0,
          location_street: 0,
          location_city: 0,
          location_barangay: 0
        }
      });
    });
  };

  canThisSignUp = () => {
    var validityList = this.state.placesValidity;

    for (var key in validityList) {
      if (validityList[key] != 1) return false;
    }

    return true;
  };

  renderBarangay = () => {
    var city = this.state.placesForm.location_city;
    if (city == null || city == "") return;

    var array = this.state.placesOptions;
    var barangayList = array.filter(value => value.city_name == city);
    return barangayList.map((value, index) => {
      return (
        <option value={value.city_barangay} key={index}>
          {value.city_barangay}
        </option>
      );
    });
  };

  setValue = (key, ref) => {
    var value = ref.current.value;
    this.setState(prevState => {
      prevState.placesForm[key] = value;

      return prevState;
    });
  };

  renderCityList = () => {
    var array = this.state.placesOptions;
    var uniqueCities = array
      .map(item => item.city_name)
      .filter((value, index, self) => self.indexOf(value) === index);

    return uniqueCities.map((value, index) => {
      return (
        <option value={value} key={index}>
          {value}
        </option>
      );
    });
  };

  formValid = value => {
    if (value == 0 || value == 1) {
      return "";
    }

    return "form-error";
  };

  checkIfNull = (e, key, reference) => {
    var value = reference.current.value;
    if (value === "") {
      this.setState(prevState => {
        var prevValidity = prevState.placesValidity;
        prevValidity[key] = -1;
        return {
          placesValidity: prevValidity
        };
      });
    } else {
      this.setState(prevState => {
        var prevData = prevState.placesForm;
        var prevValidity = prevState.placesValidity;
        prevData[key] = value;
        prevValidity[key] = 1;
        return {
          placesForm: prevData,
          placesValidity: prevValidity
        };
      });
    }
  };

  render() {
    return (
      <div className="booking-container">
        <h2 className="booking-header">
          My places
          {this.renderButton(this.props.data)}
        </h2>
        <hr />
        <div className="booking-list">{this.renderList()}</div>
        {this.renderForm()}
      </div>
    );
  }
}
