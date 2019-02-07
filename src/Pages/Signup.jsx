import React from "react";
import Data from "../Helpers/Data";
import { Redirect } from "react-router-dom";
import bcrypt from "bcryptjs";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMessage: "",
      signUpData: {
        email_address: null,
        password: null,
        first_name: null,
        middle_name: null,
        last_name: null,
        gender: null,
        birth_date: null,
        contact_number: null
      },
      formValidity: {
        email: 0,
        password: 0,
        first_name: 0,
        last_name: 0,
        birth_date: 0,
        contact_number: 0,
        gender: 0
      },
      signUpSuccessful: 0
    };
    this.passwordField = React.createRef();
    this.firstNameField = React.createRef();
    this.middleNameField = React.createRef();
    this.lastNameField = React.createRef();
    this.emailField = React.createRef();
    this.genderMField = React.createRef();
    this.genderFField = React.createRef();
    this.contactNumberField = React.createRef();
    this.dateOfBirthField = React.createRef();
  }

  signup = e => {
    if (!this.canThisSignUp()) return;

    this.setState({
      formValidity: {
        email: 0,
        password: 0,
        first_name: 0,
        last_name: 0,
        birth_date: 0,
        contact_number: 0
      }
    });

    var data = this.state.signUpData;
    data.password = bcrypt.hashSync(this.state.signUpData.password, 8);

    Data.sendData("/api/users", this.state.signUpData, (result, data) => {
      if (result) {
        this.setState({
          signUpSuccessful: 1
        });
        return;
      }
      else{
              this.setState({
                signUpSuccessful: -1
              });
              return;
      }
    });
  };

  checkEmail = e => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var email = this.emailField.current.value;
    if (re.test(email)) {
      this.setState(function(prevState) {
        var prevData = prevState.signUpData;
        var prevValidity = prevState.formValidity;
        prevValidity.email = 1;
        prevData.email_address = email;
        return {
          signUpData: prevData,
          formValidity: prevValidity
        };
      });
    } else {
      this.setState(function(prevState) {
        var prevValidity = prevState.formValidity;
        prevValidity.email = -1;

        return {
          formValidity: prevValidity
        };
      });
    }
  };

  setGender = (e,value) => {
    this.setState((prevState)=>{
      var prevData = prevState.signUpData;
      var prevValidity = prevState.formValidity;

      prevData.gender = value;
      prevValidity.gender = 1;

      return {
        formValidity:prevValidity,
        signUpData:prevData
      }
    })
  }

  checkPassword = e => {
    var password = this.passwordField.current.value;
    if (password) {
      this.setState(function(prevState) {
        var prevData = prevState.signUpData;
        var prevValidity = prevState.formValidity;
        prevValidity.password = 1;
        prevData.password = password;
        return {
          signUpData: prevData,
          formValidity: prevValidity
        };
      });
    } else {
      this.setState(function(prevState) {
        var prevValidity = prevState.formValidity;
        prevValidity.password = -1;

        return {
          formValidity: prevValidity
        };
      });
    }
  };

  checkIfNull = (e, key, reference) => {
    var value = reference.current.value;
    if (value === "") {
      this.setState(prevState => {
        var prevValidity = prevState.formValidity;
        prevValidity[key] = -1;
        return {
          formValidity: prevValidity
        };
      });
    } else {
      this.setState(prevState => {
        var prevData = prevState.signUpData;
        var prevValidity = prevState.formValidity;
        prevData[key] = value;
        prevValidity[key] = 1;
        return {
          signUpData: prevData,
          formValidity: prevValidity
        };
      });
    }
  };

  canThisSignUp = () => {
    var validityList = this.state.formValidity;

    for (var key in validityList) {
      if (validityList[key] != 1) return false;
    }

    return true;
  };

  formValid = value => {
    if (value == 0 || value == 1) {
      return "";
    }

    return "form-error";
  };

  setCompleted = () => {

    return (
      <div className="login-container">
      <div className="login-backdrop">
        <img
          className="img-logo"
          src="https://greenklean.ph/front/img/GKlean House Icon Y.png"
        />
        <h3 className="brand-text-color">Welcome to Greenklean</h3>
        <div className="form-region">
          <h2 className="form-header">You have successfully signed up!</h2>
          <hr />
          <a href="/login" className="signup-btn">
            Back to login
          </a>
        </div>
      </div>
    </div>
    );
  }

  render() {
    if (localStorage.getItem("credentials") != null) {
      return <Redirect to="/booking" />;
    }

    if(this.state.signUpSuccessful == 1){
      return this.setCompleted();
    }

    return (
      <div className="login-container">
        <div className="login-backdrop">
          <img
            className="img-logo"
            src="https://greenklean.ph/front/img/GKlean House Icon Y.png"
          />
          <h3 className="brand-text-color">Welcome to Greenklean</h3>
          <div className="form-region">
            <h4 className="form-header">Sign up</h4>
            <span
              className="login-message error"
              style={{ display: (this.state.signUpSuccessful == -1)? "block":"none" }}
            >Failed to signup, try again or contact administrator</span>
            <div className="form-row nowrap">
              <label className="form-label">
                E-mail address*
                <input
                  type="email"
                  className={
                    "form-field " +
                    this.formValid(this.state.formValidity.email)
                  }
                  ref={this.emailField}
                  onBlur={e => this.checkEmail(e)}
                />
              </label>
              <label className="form-label">
                Password*
                <input
                  type="password"
                  className={
                    "form-field " +
                    this.formValid(this.state.formValidity.password)
                  }
                  ref={this.passwordField}
                  onBlur={e => this.checkPassword(e)}
                />
              </label>
            </div>
            <hr />
            <div className="form-row">
              <label className="form-label">
                First name*
                <input
                  type="text"
                  className={
                    "form-field " +
                    this.formValid(this.state.formValidity.first_name)
                  }
                  ref={this.firstNameField}
                  onBlur={e =>
                    this.checkIfNull(e, "first_name", this.firstNameField)
                  }
                />
              </label>
              <label className="form-label">
                Middle name
                <input
                  type="text"
                  className="form-field"
                  ref={this.middleNameField}
                />
              </label>
              <label className="form-label">
                Last name*
                <input
                  type="text"
                  className={
                    "form-field " +
                    this.formValid(this.state.formValidity.last_name)
                  }
                  ref={this.lastNameField}
                  onBlur={e =>
                    this.checkIfNull(e, "last_name", this.lastNameField)
                  }
                />
              </label>
            </div>
            <div className="form-row nowrap">
              <label className="form-label">
                Contact number*
                <input
                  type="tel"
                  className={
                    "form-field " +
                    this.formValid(this.state.formValidity.contact_number)
                  }
                  ref={this.contactNumberField}
                  onBlur={e =>
                    this.checkIfNull(
                      e,
                      "contact_number",
                      this.contactNumberField
                    )
                  }
                />
              </label>
              <label className="form-label">
                Date of Birth*
                <input
                  type="date"
                  className={
                    "form-field " +
                    this.formValid(this.state.formValidity.birth_date)
                  }
                  ref={this.dateOfBirthField}
                  onBlur={e =>
                    this.checkIfNull(e, "birth_date", this.dateOfBirthField)
                  }
                />
              </label>
              <label className="form-label lower-gutter">
                <span className="field-title">Gender</span>
                <label htmlFor="male">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    ref={this.genderMField}
                    onChange={e => this.setGender(e, 0)}
                  />
                  <span>Male</span>
                </label>
                <label htmlFor="female">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    ref={this.genderFField}
                    onChange={e => this.setGender(e, 1)}
                  />
                  <span>Female</span>
                </label>
              </label>
            </div>
            <button
              className={
                this.canThisSignUp() ? "login-btn" : "login-btn disabled"
              }
              onClick={e => this.signup(e)}
            >
              Sign up
            </button>
            <span className="block-span">or</span>
            <a href="/login" className="signup-btn">
              Back to login
            </a>
          </div>
        </div>
      </div>
    );
  }
}
