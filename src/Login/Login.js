import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from './../store/Actions/index';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import './login.css';
function Login({ history }) {
    const [loading, setLoading] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const dispach = useDispatch();
    async function performLogin(e) {

        setLoading(true);
        let username = document.getElementById('usernametxt').value;
        let password = document.getElementById('passwordtxt').value;
        let headers = new Headers();
        headers.append("username", username)
        headers.append("password", password)


        var requestOptions = {
            method: 'GET',
            headers: headers,
            redirect: 'follow'
        };
        console.log(process.env.REACT_APP_BASE_URL);
        let res = await fetch(process.env.REACT_APP_BASE_URL + "/login", requestOptions);
        console.log(res);
        let data = await res.json();
        console.log(data);
        if (data.success === undefined) {
            dispach(updateUser(data.data));
            if (data.sign == "true") {
                history.replace("/admin");
            } else {
                history.replace("/signing");
            }

        } else if (data.success == false) {
            setUserExists(true);
            console.log("USER doesn't Exists");
        }
    }
    document.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            performLogin();
        }
    })
    return (

        <div class="limiter">
            <div class="container-login100" >
                <div class="wrap-login100" id="loginform">
                    <span class="login100-form-title">
                        Account Login
				    </span>
                    <div class="login100-form validate-form">

                        <div class="wrap-input100 validate-input" data-validate="Enter username">
                            <div style={{ display: "flex" }} >
                                <PersonIcon style={{ margin: " auto 0 ", marginLeft: "20px" }} />
                                <input class="input100" placeholder="User name" id="usernametxt" />
                            </div>
                            <span class="focus-input100"></span>
                        </div>

                        <div class="wrap-input100 validate-input" data-validate="Enter password">
                            <div style={{ display: "flex" }} >
                                <LockIcon style={{ margin: " auto 0 ", marginLeft: "20px" }} />
                                <input class="input100" placeholder="Password" id="passwordtxt" />
                            </div>
                            <span class="focus-input100"></span>
                        </div>

                        <div class="container-login100-form-btn">
                            <button class="login100-form-btn" id="loginbtn" onClick={performLogin}>Log In</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>



    )
}

export default Login;
