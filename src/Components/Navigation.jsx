import React from 'react';
import {Link} from 'react-router-dom';

export default class Navigation extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            displayMenu:false
        }
    }

    toggleMenu = (e) =>{
        this.setState(function(prevState, props) {
            return{
                displayMenu:!prevState.displayMenu
            }
        });
    }

    render(){
        var block = this.state.displayMenu? "block":"";

        return(
            <div className="navigation__wrapper">
                <div className="navigation__col navigation__logo">
                    <img className="img-logo" src="https://greenklean.ph/front/img/GKlean House Icon Y.png" />
                </div>
                <div className="navigation__col navigation-menu" onClick={(e) => this.toggleMenu(e)}>
                    <i className="la la-bars"></i>
                </div>
                <div className="navigation__col navigation--control" style={{display:block}}>
                    <ul className="navigation_links">
                        <li className="navigation__link is-active">
                            <Link className="anchor" to="/booking">Home</Link>
                        </li>
                        <li className="navigation__link">
                            <Link className="anchor" to="/booking/places">Places</Link>
                        </li>
                        <li className="navigation__link">
                            <Link className="anchor" to="/booking/places">History</Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}