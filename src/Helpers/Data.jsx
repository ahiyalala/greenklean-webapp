import React from 'react';
const baseUrl = 'http://localhost:80';

export default class Data extends React.Component{
    

    static getData(url,fallback){
        fetch(baseUrl+url).then(
            result => fallback(result)
        );
    }

    static async getAuthenticatedData(url, fallback){
        var profile = JSON.parse(localStorage.getItem('credentials'));

        fetch(baseUrl+url, {
            method:'get',
            headers: new Headers({
                'Authentication':profile.email_address+" "+profile.user_token,
                'Content-Type': "application/json"
            })
        })
        .then(response => {
            if(response.ok)
                return response.json()

            throw new Error('fail');
        })
        .then(data => fallback(true,data))
        .catch(error => fallback(false,error));
    }

    static async sendData(url,content,fallback){
        fetch(baseUrl+url,{
            method: 'post',
            body: JSON.stringify(content)
        })
        .then(response => response.json())
        .then(data => fallback(data));
    }

    static async authenticateUser(url,content,fallback){
        fetch(baseUrl+url,{
            method: 'post',
            body: JSON.stringify(content)
        })
        .then(response => {
            if(response.ok)
                return response.json()

            throw new Error('fail');
        })
        .then(data => fallback(true,data))
        .catch(error => fallback(false,error));
    }
}