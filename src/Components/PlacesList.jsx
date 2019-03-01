import React from "react";
import Data from "../Helpers/Data";

export default class Booking extends React.Component {
    renderList = (data) => {
        if(data == null){
            return (
                <div className="no-place">
                    <strong className="no-place-text">
                        Loading...
                    </strong>
                </div>
            )
        }
        if(data.length == 0 ){
            return (
                <div className="no-place">
                    <strong className="no-place-text">
                        You haven't added your place yet.
                    </strong>
                    <a className="btn">Add here</a>
                </div>
            )
        }

        return <span> Has data </span>
    }

    renderButton = (data) => {
        if(data == null) return;
        if(data.length > 0){
            return (
                <a
                className="booking-header__scheduler"
                href="javascript:void(0);"
            >
                Add new place
            </a>
            )
        }

        return;
    }

    render(){
        return (
            <div className="booking-container">
                <h2 className="booking-header">
                    My places
                    {this.renderButton(this.props.data)}
                </h2>
                <hr />
                <div className="booking-list">
                    {this.renderList(this.props.data)}
                </div>
            </div>
        )
    }
}