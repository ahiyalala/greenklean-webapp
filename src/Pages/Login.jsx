import React from "react";
import Data from "../Helpers/Data";
import { Redirect, Link } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {},
      hasMessage: ""
    };
    this.usernameField = React.createRef();
    this.passwordField = React.createRef();
    this.login = this.loginEvent.bind(this);
  }

  loginEvent(e) {
    var credentials = {
      email_address: this.usernameField.current.value,
      password: this.passwordField.current.value
    };
    Data.authenticateUser("/api/users/login", credentials, (status, result) => {
      if (status) {
        delete result.password;
        localStorage.setItem("credentials", JSON.stringify(result));
        this.setState({ hasMessage: "" });
      } else {
        this.setState({ hasMessage: "block" });
      }
    });
  }

  logInByEnter = event => {
    var key = event.key || event.keyCode;
    if (key === "Enter" || key === 13) {
      this.loginEvent(event);
    }
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
            <span
              className="login-message error"
              style={{ display: this.state.hasMessage }}
            >
              Error logging in
            </span>
            <label className="form-label">
              Username
              <input
                type="text"
                className="form-field"
                ref={this.usernameField}
                onKeyDown={e => this.logInByEnter(e)}
              />
            </label>
            <label className="form-label">
              Password
              <input
                type="password"
                className="form-field"
                ref={this.passwordField}
                onKeyDown={e => this.logInByEnter(e)}
              />
            </label>
            <button className="login-btn" onClick={e => this.login(e)}>
              Login
            </button>
            <span className="block-span">or</span>
            <Link to="/signup" className="signup-btn">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
