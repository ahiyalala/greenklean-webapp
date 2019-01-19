import React from 'react';
import Navigation from '../Components/Navigation';
import { Redirect } from 'react-router-dom'

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.logoutEl = React.createRef();
        this.state = {
            hasLoggedOut:false
        }
    }

    logoutEvent = (e) => {
        localStorage.removeItem('credentials');
        this.setState({hasLoggedOut:true});
    }

    render(){
        if(this.state.hasLoggedOut)
            return <Redirect to='/login' />

        return(
            <div>
                <Navigation />
                <div className="container">
                    <div className="profile-sidebar">
                        <h4>Hello, Customer</h4>
                        <hr />
                        <div className="dashboard-details">
                            <p className="subdetails">You have 4 pending appointments</p>
                        </div>
                        <a href="javascript:void(0)" className="sidebar-navigation">View your profile<i className="la la-arrow-right"></i></a>
                        <a href="javascript:void(0)" onClick={this.logoutEvent} className="logout-button">Logout</a>
                    </div>
                    <div className="booking-container">
                        <h2 class="booking-header">My appointments</h2>
                        <small className="booking-category"><strong>Needs Review</strong></small>
                        <div className="booking-list">
                            <div className="booking-block">
                                <div className="booking-block__section">
                                    <strong className="booking-description">Express Clean, 2 cleaners</strong>
                                    <small className="booking-description">January 30, 2019 12:00PM</small>
                                </div>
                                <div className="booking-block__section booking-block--right">
                                    <strong className="booking-description">700php</strong>
                                </div>
                            </div>
                            <div className="booking-block">
                                <div className="booking-block__section">
                                    <strong className="booking-description">Express Clean, 2 cleaners</strong>
                                    <small className="booking-description">January 30, 2019 12:00PM</small>
                                </div>
                                <div className="booking-block__section booking-block--right">
                                    <strong className="booking-description">700php</strong>
                                </div>
                            </div>
                        </div>
                        <small className="booking-category"><strong>Upcoming</strong></small>
                        <div className="booking-list">
                            <div className="booking-block">
                                <div className="booking-block__section">
                                    <strong className="booking-description">Express Clean, 2 cleaners</strong>
                                    <small className="booking-description">January 30, 2019 12:00PM</small>
                                </div>
                                <div className="booking-block__section booking-block--right">
                                    <strong className="booking-description">700php</strong>
                                </div>
                            </div>
                            <div className="booking-block">
                                <div className="booking-block__section">
                                    <strong className="booking-description">Express Clean, 2 cleaners</strong>
                                    <small className="booking-description">January 30, 2019 12:00PM</small>
                                </div>
                                <div className="booking-block__section booking-block--right">
                                    <strong className="booking-description">700php</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}