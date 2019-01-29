import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Places from './Pages/Places';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      localStorage.getItem('credentials') != null
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
)

ReactDOM.render(
    <Router>
        <div>
            <PrivateRoute path="/booking" exact component={Dashboard} /> 
            <PrivateRoute path="/booking/places" component={Places} />   
            <Route exact path="/login" component={Login} />
        </div>
    </Router>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
