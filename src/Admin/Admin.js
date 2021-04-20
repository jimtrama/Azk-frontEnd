import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/Actions';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import EmailIcon from '@material-ui/icons/Email';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import PublishIcon from '@material-ui/icons/Publish';
import { useEffect } from 'react';
import { Button, Modal } from '@material-ui/core';
function Admin({ history }) {
    const [file, setFile] = useState();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");
    const [sign, setSign] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [id, setId] = useState(null);
    useEffect(() => {
        const load = async () => {
            let res = await fetch(process.env.REACT_APP_BASE_URL + "/users");
            let data = await res.json();
            setUsers(data);
        }
        load();
    }, [])
    function logout() {
        dispatch(updateUser({}));
        history.replace('/');
    }
    async function createUser() {
        let username = document.getElementById('user').value
        let password = document.getElementById('pass').value
        let nickname = document.getElementById('nick').value
        let name = document.getElementById('name').value
        let filedsToUpdate = [{ username }, { nickname }, { name }, { password }]
        filedsToUpdate = filedsToUpdate.filter(filed => {
            for (let key in filed) {
                return (Boolean(filed[key]))
            }
        })

        if (username === undefined || username === "" || password === undefined || password === "" || file === undefined) {
            console.log("user data not valid");
            return;
        }
        var formdata = new FormData();
        formdata.append("data", JSON.stringify(filedsToUpdate));
        formdata.append("file", file);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/newuser", requestOptions);
        let data = await res.json();
        console.log(data);
        document.getElementById('user').value = "";
        document.getElementById('pass').value = "";
        document.getElementById('nick').value = "";
        document.getElementById('name').value = "";
    }
    const openModal = () => {
        setSign(null);
        setAvatar(null)
        setOpen(true);
    }
    async function edit() {

        let nickname = document.getElementById('editusernickname').value
        let name = document.getElementById('edituser-name').value
        let password = document.getElementById('edituserpassword').value
        let filedsToUpdate = [{ username }, { nickname }, { name }, { password }]
        filedsToUpdate = filedsToUpdate.filter(filed => {
            for (let key in filed) {
                return (Boolean(filed[key]))
            }
        })
        console.log(id);
        console.log(filedsToUpdate);


        var formdata = new FormData();
        formdata.append("id", id);
        formdata.append("data", JSON.stringify(filedsToUpdate));
        if (sign) {
            formdata.append("sign", sign);
        }
        if (avatar) {
            formdata.append("avatar", avatar);
        }


        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/edituser", requestOptions);
        let data = await res.json();
        console.log(data);
        if (data.success === true) {
            window.location.reload();
        }
    }
    return (
        <>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "400px", height: "400px", background: "white" }}>
                    <div style={{ background: "white", width: '100%', height: "100%" }}>
                        {/* <div style={{ display: "flex" }}>
                            <span>Username:</span>
                            <input style={{ background: "lightgrey" }} type="text" placeholder={username} id="edituserusername" />
                        </div> */}
                        <div style={{ display: "flex" }}>
                            <span>Nickname:</span>
                            <input style={{ background: "lightgrey" }} type="text" placeholder={nickname} id="editusernickname" />
                        </div>
                        <div style={{ display: "flex" }}>
                            <span>Name:</span>
                            <input style={{ background: "lightgrey" }} type="text" placeholder={name} id="edituser-name" />
                        </div>
                        <div style={{ display: "flex" }}>
                            <span>Password:</span>
                            <input style={{ background: "lightgrey" }} type="text" id="edituserpassword" />
                        </div>
                        <div style={{ display: "flex", width: "100%" }}>
                            <span>Sign:</span>
                            <input type="file" multiple={false} onChange={(e) => { setSign(e.target.files[0]); }} />
                        </div>
                        <div style={{ display: "flex", width: "100%" }}>
                            <span>Avatar:</span>
                            <input type="file" multiple={false} onChange={(e) => { setAvatar(e.target.files[0]); }} />
                        </div>


                        <button onClick={edit}>Edit</button>
                    </div>

                </div>

            </Modal>
            <div class="limiter">
                <div class="container-login100" style={{ display: "flex", flexDirection: "column" }}>
                    <div class="wrap-login100-admin">
                        <span class="login100-form-title">
                            Account Creation
				    </span>
                        <div class="login100-form-admin validate-form">
                            <div style={{ display: "flex" }}>
                                <div class="wrap-input100 validate-input" style={{ marginRight: "10px" }} data-validate="Enter username">
                                    <div style={{ display: "flex" }} >
                                        <PersonIcon style={{ margin: " auto 0 ", marginLeft: "20px" }} />
                                        <input class="input100" placeholder="Username" id="user" />

                                    </div>
                                    <span class="focus-input100"></span>
                                </div>

                                <div class="wrap-input100 validate-input" data-validate="Enter password">
                                    <div style={{ display: "flex" }} >
                                        <LockIcon style={{ margin: " auto 0 ", marginLeft: "20px" }} />
                                        <input class="input100" placeholder="Password" id="pass" />
                                    </div>
                                    <span class="focus-input100"></span>
                                </div>

                            </div>
                            <div style={{ display: "flex" }}>
                                <div class="wrap-input100 validate-input" style={{ marginRight: "10px" }} data-validate="Enter username">
                                    <div style={{ display: "flex" }} >
                                        <AccessibilityNewIcon style={{ margin: " auto 0 ", marginLeft: "20px" }} />
                                        <input class="input100" placeholder="Nickname" id="nick" />

                                    </div>
                                    <span class="focus-input100"></span>
                                </div>

                                <div class="wrap-input100 validate-input" data-validate="Enter password">
                                    <div style={{ display: "flex" }} >
                                        <PersonIcon style={{ margin: " auto 0 ", marginLeft: "20px" }} />
                                        <input class="input100" placeholder="Name" id="name" />
                                    </div>
                                    <span class="focus-input100"></span>
                                </div>

                            </div>

                            <div class="container-login100-form-btn-admin">
                                <span id="file-name"></span>
                                <label for="file-upload" style={{ cursor: "pointer" }} class="login100-form-btn-admin-sign">
                                    <PublishIcon style={{ position: "absolute", left: "60" }} />
                             Upload Sign
                            </label>
                                <input style={{ display: "none" }} id="file-upload" type="file" multiple={false} onChange={(e) => { setFile(e.target.files[0]); document.getElementById('file-name').innerHTML = e.target.files[0].name; }} />
                                <button class="login100-form-btn-admin" id="loginbtn" onClick={createUser}>Create User</button>
                                <button class="login100-form-btn-admin" id="loginbtn" onClick={logout}>Logout</button>
                            </div>

                        </div>
                    </div>
                    {
                        users.map((user) => (
                            <div style={{ background: "white", width: '200px', height: "100px", marginBottom: "10px" }}>
                                <div style={{ display: "flex" }}>
                                    <span>Username:</span>
                                    <span>{user.username}</span>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <span>Nickname:</span>
                                    <span>{user.nickname}</span>
                                </div>
                                <div style={{ display: "flex" }}>
                                    <span>Name:</span>
                                    <span>{user.name}</span>
                                </div>

                                <button onClick={() => { setId(user._id); setUsername(user.username); setNickname(user.nickname); setName(user.name); openModal() }}>Edit</button>
                            </div>
                        ))
                    }
                </div>

            </div>

        </>

    )
}

export default Admin;
