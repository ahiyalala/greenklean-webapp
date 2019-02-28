import React from "react";
import { Link } from "react-router-dom";

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayMenu: false
    };
  }

  toggleMenu = e => {
    this.setState(function(prevState, props) {
      return {
        displayMenu: !prevState.displayMenu
      };
    });
  };

  isActive = path => {
    return this.props.path == path ? "is-active" : "";
  };

  render() {
    var block = this.state.displayMenu ? "block" : "";

    return (
      <div className="navigation__wrapper">
        <div className="navigation__col navigation__logo">
          <img
            className="img-logo"
            src="https://greenklean.ph/front/img/GKlean House Icon Y.png"
          />
        </div>
        <div
          className="navigation__col navigation-menu"
          onClick={e => this.toggleMenu(e)}
        >
          <i className="la la-bars" />
        </div>
        <div
          className="navigation__col navigation--control"
          style={{ display: block }}
        >
          <ul className="navigation_links">
            <li className={"navigation__link " + this.isActive("/booking")}>
              <Link className="anchor" to="/booking">
                Home
              </Link>
            </li>
            <li
              className={"navigation__link " + this.isActive("/booking/places")}
            >
              <Link className="anchor" to="/booking/places">
                Places
              </Link>
            </li>
            <li
              className={
                "navigation__link " + this.isActive("/booking/history")
              }
            >
              <Link className="anchor" to="/booking/history">
                History
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
