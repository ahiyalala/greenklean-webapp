import React from "react";
import Data from "../Helpers/Data";
import { Redirect } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMessage: "",
      signUpData: {
        email_address: null,
        password: null
      },
      formValidity: {
        email: 0,
        password: 0
      }
    };
    this.passwordField = React.createRef();
    this.firstNameField = React.createRef();
    this.middleNameField = React.createRef();
    this.lastNameField = React.createRef();
    this.emailField = React.createRef();
    this.genderMField = React.createRef();
    this.genderFField = React.createRef();
    this.contactNumberField = React.createRef();
    this.login = this.signupEvent.bind(this);
  }

  signupEvent(e) {}

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

  formValid = value => {
    if (value == 0 || value == 1) {
      return "";
    }

    return "form-error";
  };

  render() {
    if (localStorage.getItem("credentials") != null) {
      return <Redirect to="/booking" />;
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
              style={{ display: this.state.hasMessage }}
            />
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
                  className="form-field"
                  ref={this.firstNameField}
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
                  className="form-field"
                  ref={this.lastNameField}
                />
              </label>
            </div>
            <div className="form-row nowrap">
              <label className="form-label">
                Contact number*
                <input
                  type="tel"
                  className="form-field"
                  ref={this.contactNumberField}
                />
              </label>
              <label className="form-label">
                Date of Birth*
                <input
                  type="date"
                  className="form-field"
                  ref={this.contactNumberField}
                />
              </label>
              <label className="form-label lower-gutter">
                <span className="field-title">Gender</span>
                <label for="male">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    ref={this.genderMField}
                  />
                  <span>Male</span>
                </label>
                <label for="female">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    ref={this.genderFField}
                  />
                  <span>Female</span>
                </label>
              </label>
            </div>
            <button className="login-btn" onClick={e => this.signup(e)}>
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
