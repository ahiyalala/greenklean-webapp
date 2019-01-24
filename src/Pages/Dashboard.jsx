import React from 'react';
import Navigation from '../Components/Navigation';
import { Redirect } from 'react-router-dom';
import Data from '../Helpers/Data';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.logoutEl = React.createRef();
        this.state = {
            hasLoggedOut:false,
            isWindowClosed:true,
            user:null,
            selectedAppointment:{
                housekeepers:[]
            },
            appointments:{
                all:[],
                finished:[],
                pending:[]
            }
        }
    }

    logoutEvent = (e) => {
        localStorage.removeItem('credentials');
        this.setState({hasLoggedOut:true});
    }

    toggleWindow = (e) => {
        this.setState((prevState)=>{
            return {
                isWindowClosed:!prevState.isWindowClosed,
                selectedAppointment:{}
            }
        })
    }

    openWindow = (e,id) => {
        var appointment = this.state.appointments.all.filter(item => item.service_cleaning_id == id);
        this.setState((prevState)=>{
            return {
                isWindowClosed:!prevState.isWindowClosed,
                selectedAppointment:appointment
            }
        })
    }

    componentDidMount(){
        //Profile
        var profile = JSON.parse(localStorage.getItem('credentials'));

        //Appointments
        Data.getAuthenticatedData('/api/appointments',(result,data) => {
            if(!result) return;

            var needsReview = data.filter(item => item.is_finished == 1);
            var pending = data.filter(item => item.is_finished == 0);
            this.setState({
                appointments:{
                    all:data,
                    finished:needsReview,
                    pending:pending
                }
            });
        });

        this.setState({
            user:{
                firstName:profile.first_name,
                lastName:profile.last_name,
                middleName:profile.middle_name,
                email:profile.email_address,
                gender:profile.gender,
                contactNumber:profile.contact_number,
                birthDate:profile.birth_date
            }
        });

    }

    render(){
        if(this.state.hasLoggedOut)
            return <Redirect to='/login' />

        return(
            <div>
                <Navigation />
                <div className="container">
                    <div className="profile-sidebar">
                        <h4>Hello, {(this.state.user)? this.state.user.firstName:"Customer"}</h4>
                        <hr />
                        <div className="dashboard-details">
                            <p className="subdetails">You have {this.state.appointments.pending.length} pending appointments</p>
                        </div>
                        <a href="javascript:void(0)" className="sidebar-navigation">View your profile<i className="la la-arrow-right"></i></a>
                        <a href="javascript:void(0)" onClick={this.logoutEvent} className="logout-button">Logout</a>
                    </div>
                    <div className="booking-container">
                        <h2 className="booking-header">My appointments</h2>
                        <small className="booking-category"><strong>Pending</strong></small>
                        <div className="booking-list">
                            {
                                this.state.appointments.pending.map((value,index) => {
                                    return (
                                        <div className="booking-block" onClick={(e) => this.openWindow(e,value.service_cleaning_id)} key={index}>
                                            <div className="booking-block__section">
                                                <strong className="booking-description">{value.service.service_type_key}, {value.housekeepers.length} cleaners</strong>
                                                <small className="booking-description">{value.date} {value.start_time}</small>
                                            </div>
                                            <div className="booking-block__section booking-block--right">
                                                <strong className="booking-description">PHP{value.total_price}</strong>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="booking-details__backdrop" style={{display:(this.state.isWindowClosed)?'none':''}}>
                            <div className="booking-details">
                                <div className="booking-details__header">
                                    <a class="booking-details__close" onClick={(e) => this.toggleWindow(e)}>&times;</a>
                                    <small className="booking-details__subtext">Appointment details</small>
                                    <h4 className="booking-details__service-type">Express Cleaning</h4>
                                    <span className="booking-details__data">Date: <span className="booking-details__value">{this.state.selectedAppointment.date}</span></span>
                                    <span className="booking-details__data">Price: <span className="booking-details__value">PHP{this.state.selectedAppointment.total_price}</span></span>
                                </div>
                                <div className="booking-details__content">
                                    <small className="booking-details__subtext">Housekeepers ({this.state.selectedAppointment.housekeepers.length})</small>
                                    <ul className="booking-details__housekeepers">
                                        <li className="booking-details__housekeeper">
                                            {
                                                this.state.selectedAppointment.housekeepers.map((value,index)=>{
                                                    return (
                                                        <li className="booking-details__housekeeper">
                                                            {value.last_name+', '+value.first_name+' '+value.middle_name.substring(0,1)+'.'}
                                                            <span className="booking-details__rating booking-details__rating--no-rating">
                                                                No rating yet
                                                            </span>
                                                        </li>
                                                    )
                                                })
                                            }
                                            Llanera, Timothy Z. 
                                            <span className="booking-details__rating">
                                                <i className="la la-star"></i>
                                                <i className="la la-star"></i>
                                                <i className="la la-star"></i>
                                                <i className="la la-star"></i>
                                                <i className="la la-star-half"></i>
                                            </span>
                                        </li>
                                        <li className="booking-details__housekeeper">
                                            Llanera, Timothy Z. 
                                            <span className="booking-details__rating booking-details__rating--no-rating">
                                                No rating yet
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <a className="booking-details__cancel">
                                    <span>Cancel booking</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}