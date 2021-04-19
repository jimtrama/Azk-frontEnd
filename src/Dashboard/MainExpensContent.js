import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './dashboard.css';
import { Checkbox, CircularProgress } from '@material-ui/core';
//import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';


import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import updateChecked from '../store/Reducers/updateChecked';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIcon from '@material-ui/icons/AddCircle';
import PublishIcon from '@material-ui/icons/Publish';
import './pdfviewers.css'

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent !important',
        border: 'none',
        outline: 'none'
    },

}));

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}
function MainExpensContent({ stageWithOneFileMain, stageWithMoreFilesMain, expenseId, expense }) {
    let userCokkie = useSelector(state => state.persistedStore);
    const [checkedForOne, setCheckedFOrOne] = useState([[], [], [], []]);
    const [checkedForMore, setCheckedForMore] = useState([[], [], [], [], [], [], [], [], [], [], [], []]);
    const [stageWithOneFile, setStageWithOneFile] = useState(stageWithOneFileMain);
    const [stageWithMoreFiles, setStageWithMoreFiles] = useState(stageWithMoreFilesMain);
    const [openFileModal, setOpenFileModal] = useState(false);
    const [stage, setStage] = useState(0);
    const [subStage, setSubStage] = useState(0);
    const dispatch = useDispatch();
    const updateComponent = useForceUpdate();
    const [showPDF, setShowPDF] = useState(false);
    console.log(stageWithMoreFiles);
    function FileModal({ stage, expId, subStage }) {
        const classes = useStyles();
        const [file, setFile] = useState();
        const [users, setUsers] = useState([]);
        const [checkedM, setCheckedM] = useState({});
        const [numberOfPages, setNumberOfPages] = useState(null);
        const [pdf, setPdf] = useState(null);
        const [errorUploading, setErrorUploading] = useState(null);
        const [fileId, setFileId] = useState('');
        useEffect(() => {


            async function loadPdf() {
                let path = "";
                if (stage >= 4) {
                    expense.files[1].forEach((arrayfiles) => {
                        arrayfiles.forEach(file => {
                            if (file.stage == stage && file.substage == subStage) {
                                path = file.path;
                                setFileId(file.fileId);
                            }
                        })

                    })
                } else {
                    expense.files[0].forEach((file) => {
                        if (file.stage == stage) {
                            path = file.path;
                            setFileId(file.fileId);
                        }
                    })
                }

                var myHeaders = new Headers();


                myHeaders.append("_id", encodeURIComponent(path, "utf-8"));

                var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow'
                };

                let res = await fetch(process.env.REACT_APP_BASE_URL + "/file", requestOptions);

                let temppdf = new Uint8Array(await res.arrayBuffer());
                setPdf(temppdf);

            }

            async function loadUsers() {
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };

                let res = await fetch(process.env.REACT_APP_BASE_URL + "/users", requestOptions);
                let data = await res.json();
                let usersTemp = []
                data.forEach((user) => {
                    if (user.sign !== "true") {
                        usersTemp.push(user)
                    }
                })
                setUsers(usersTemp);

            }
            if (showPDF) {
                loadPdf();
            } else {
                loadUsers();
            }


        }, [])

        const handleChange = (event, i) => {

            if (!event.target.checked) {
                setCheckedM({ ...checkedM, [i]: event.target.checked });
                return;
            }
            let count = 0;


            users.forEach(user => {

                if (checkedM[user._id]) {
                    count++;
                }
            }
            );


            if (stage !== 1 && stage !== 4 && stage != 0) {
                if (count < 1) {
                    setCheckedM({ ...checkedM, [i]: event.target.checked });
                }
                else {
                    for (let user of users) {
                        if (checkedM[user._id]) {
                            setCheckedM({ ...checkedM, [user._id]: false, [i]: event.target.checked });
                            break;
                        }
                    }

                }
            }
            if (stage === 1 || stage === 0) {
                if (count < 2) {
                    setCheckedM({ ...checkedM, [i]: event.target.checked });
                }
                else {
                    for (let user of users) {
                        if (checkedM[user._id]) {
                            setCheckedM({ ...checkedM, [user._id]: false, [i]: event.target.checked });
                            break;
                        }
                    }

                }
            }
            if (stage === 4) {
                if (count < 3) {
                    setCheckedM({ ...checkedM, [i]: event.target.checked });
                }
                else {
                    for (let user of users) {
                        if (checkedM[user._id]) {
                            setCheckedM({ ...checkedM, [user._id]: false, [i]: event.target.checked });
                            break;
                        }
                    }

                }
            }


        };

        const handleClose = () => {
            setOpenFileModal(false);


        };

        async function uploadFile() {
            if (!file) {
                setErrorUploading("file")
                return;
            }
            let usersThatNeedToSign = [];
            let usersCheked = 0;
            users.forEach(user => {
                if (checkedM[user._id] === false || checkedM[user._id] === undefined) {
                    usersCheked++;
                } else {
                    usersThatNeedToSign.push({ ...user, signed: false });
                }
            })
            if (usersCheked === users.length) {
                setErrorUploading("checked")
                return;
            }


            var formdata = new FormData();
            if (stage == 6) {
                let amount = document.getElementById("money").value;
                if (!amount) {
                    setErrorUploading("zero");
                    return;
                }
                formdata.append("file", file);
                formdata.append("expenseId", expId);
                formdata.append("stage", stage);
                formdata.append("substage", subStage);
                formdata.append("amount", amount);
                formdata.append("users", JSON.stringify(usersThatNeedToSign))
            } else {
                formdata.append("file", file);
                formdata.append("expenseId", expId);
                formdata.append("stage", stage);
                formdata.append("substage", subStage);
                formdata.append("users", JSON.stringify(usersThatNeedToSign))
            }

            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow'
            };
            let res = await fetch(process.env.REACT_APP_BASE_URL + '/upload', requestOptions);
            let data = await res.json();
            if (data.err == "file all ready exists") {
                setErrorUploading("exists")
            } else {
                window.location.reload();
            }

        }



        function ErrorToUpload() {
            if (errorUploading != null) {
                if (errorUploading == "exists") {
                    return (
                        <span style={{ width: "fit-content", margin: "0 auto", fontSize: "1.5rem", color: "#C35858" }}>File Name Already Exists in The {expense.name} Expense</span>
                    )
                }
                if (errorUploading == "checked") {
                    return (
                        <span style={{ width: "fit-content", margin: "0 auto", fontSize: "1.5rem", color: "#C35858" }}>Please check at least one User</span>
                    )
                }
                if (errorUploading == "zero") {
                    return (
                        <span style={{ width: "fit-content", margin: "0 auto", fontSize: "1.5rem", color: "#C35858" }}>Please Fill in the amount of the File</span>
                    )
                }
                if (errorUploading == "file") {
                    return (
                        <span style={{ width: "fit-content", margin: "0 auto", fontSize: "1.5rem", color: "#C35858" }}>Please Select a File</span>
                    )
                }
            } else {
                return <></>
            }
        }
        useEffect(() => {
            if (showPDF) {


            }
        }, [])
        function documentLoad() {
            const oldButton = document.getElementsByClassName('viewer-toolbar-right')[0].getElementsByTagName('button')[2]
            const newButton = oldButton.cloneNode(true);
            oldButton.parentNode.replaceChild(newButton, oldButton);

            const oldButtonD = document.getElementsByClassName('viewer-toolbar-right')[0].getElementsByTagName('button')[1]
            const newButtonD = oldButtonD.cloneNode(true);
            oldButtonD.parentNode.replaceChild(newButtonD, oldButtonD);

            newButton.addEventListener('click', () => {
                var file = new Blob([pdf], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL, "PRINT", "height=400,width=600");
            })
            newButtonD.addEventListener('click', () => {
                var file = new Blob([pdf], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL, "PRINT", "height=400,width=600");
            })

        }
        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openFileModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >


                    {
                        showPDF ? (
                            pdf !== null ? (
                                <div>
                                    {/* https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js 
                                        defaultScale={SpecialZoomLevel.PageFit}
                                    */}

                                    <Worker workerUrl=" https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
                                        <div id="pdfviewer" style={{ height: "100%", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%" }}>
                                            <Viewer fileUrl={pdf} onDocumentLoad={documentLoad} />
                                        </div>
                                    </Worker>

                                </div>)
                                :
                                <>Loading</>
                        )
                            : (
                                <div className="uploadFileModal">
                                    <span style={{ fontSize: "1.2rem" }}>Uploading File For Stage {stage}.</span>
                                    <div className="usersContainer">
                                        {
                                            users.lenght !== 0 ?
                                                users.map((user, i) => {

                                                    return (


                                                        <div className="userContainer">
                                                            {checkedM[user._id] ? (
                                                                <Checkbox
                                                                    color="primary"
                                                                    key={i + user.username}
                                                                    checked={true}
                                                                    onChange={(e) => handleChange(e, user._id)}
                                                                />
                                                            ) :
                                                                <Checkbox
                                                                    color="primary"
                                                                    key={i + user.username}
                                                                    checked={false}
                                                                    onChange={(e) => handleChange(e, user._id)}
                                                                />
                                                            }
                                                            <span>{user.name}</span>

                                                        </div>


                                                    )

                                                })
                                                :
                                                <CircularProgress />

                                        }
                                    </div>
                                    <div className="fileuploadContainer">
                                        <ErrorToUpload />
                                        {stage == 6 && <input className="moneyInput" type="number" placeholder="Amount" id="money" />}

                                        <div className="filePicker" >
                                            <PublishIcon />
                                            <label for="file-upload" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "100%", height: "100%", lineHeight: "40px", cursor: "pointer" }} >

                                                Choose File
                                            </label>
                                        </div>
                                        <span id="pdf-name" style={{ fontSize: "1.2rem" }}></span>
                                        <input accept=".pdf" id="file-upload" style={{ display: "none" }} type="file" multiple={false} onChange={(e) => { setFile(e.target.files[0]); document.getElementById("pdf-name").innerHTML = e.target.files[0].name; }} />
                                        <button onClick={uploadFile} className="uploadButton"><CloudUploadIcon /></button>
                                    </div>
                                </div>)

                    }







                </Modal>
            </div >
        );
    }
    const [fetchedTheData, setFetchedTheData] = useState(false);
    if (!fetchedTheData) {
        stageWithOneFile.forEach((file, i) => {
            console.log(stageWithOneFile);
            if (file.users) {
                file.users.forEach((user, index) => {
                    if (user.signed) {

                        checkedForOne[i] = [...checkedForOne[i], { [index]: true }]

                        setCheckedFOrOne(checkedForOne);



                    }
                })
            }
        })
        console.log(checkedForOne);
        stageWithMoreFiles.forEach((arrayfiles, index) => {
            arrayfiles.forEach((file, i) => {
                if (file.users) {
                    file.users.forEach((user, index) => {
                        if (user.signed) {
                            checkedForMore[file.substage][file.stage - 4] = { [file.stage - 4]: true }
                            setCheckedForMore(checkedForMore);
                        }
                    })
                }
            })

        })

        setFetchedTheData(true);
    }



    const clickedOnUploadFile = (stageV, stageType, substage) => () => {
        if (stageType === "stageStepper stageOrage" || stageType === "stageStepper stageGreen") {
            setShowPDF(true);
        } else {
            setShowPDF(false);
        }
        setStage(stageV)
        setSubStage(substage)
        setOpenFileModal(true);


    };

    const handleChangeU = (e, index, i, user, file, flag) => {
        if (flag) {
            //moreFiles
            checkedForMore[file.substage][file.stage - 4] = { [file.stage - 4]: true }
            setCheckedForMore(checkedForMore);
        } else {
            //oneFile
            checkedForOne[index] = [...checkedForOne[index], { [i]: true }]
            setCheckedFOrOne(checkedForOne);
        }
        singDocument(user, file);
        updateComponent();
    }

    async function singDocument(user, file) {
        function validate(a, b, c, user) {
            if (a === undefined || a.lenght == 0) {
                return false;
            }
            if (b === undefined || b.lenght == 0) {
                return false;
            }
            if (c === undefined || c.lenght == 0) {
                return false;
            }
            if (user === undefined || typeof (user) !== typeof ({})) {
                return false;
            }
            return true;
        }

        let fileId = file.fileId;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("userId", user._id);
        urlencoded.append("expId", expenseId);
        urlencoded.append("fileId", fileId);
        urlencoded.append("user", JSON.stringify(user));

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        if (validate(fileId, expenseId, user._id, user)) {
            let res = await fetch(process.env.REACT_APP_BASE_URL + "/singfile", requestOptions);
            let data = await res.json();

        }
        else {



            throw "not a Valid file";
        }
    }

    async function deleteFile(file, expense) {
        var myHeaders = new Headers();
        myHeaders.append("fileId", file.fileId);
        myHeaders.append("expId", expense._id);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/deletefile", requestOptions);
        let data = await res.json();
        if (data.success) {
            window.location.reload();
        }

    }
    function addRow() {
        
        if (stageWithMoreFiles.length < 15) {
            setStageWithMoreFiles([...stageWithMoreFiles, [{}, {}, {}, {}, {}, {}]])
            setMoreLess(true);
        }
    }
    const [moreLess, setMoreLess] = useState(false)
    const toggleMoreLess = () => {
        setMoreLess(!moreLess)
    }






    return (
        <div className="stagesContainer">

            <div className="stagesWithOneFile">

                {

                    stageWithOneFile.map((file, index) => {
                        let stageClass;

                        if (file.stage === index) {
                            if (file.users.length == 0) {
                                stageClass = "stageStepper";

                            } else {
                                let sigedUsers = 0;

                                file.users.forEach(user => { if (user.signed) sigedUsers++; })


                                if (sigedUsers !== file.users.length) {
                                    stageClass = "stageStepper stageOrage"
                                } else {
                                    stageClass = "stageStepper stageGreen"
                                }
                            }
                        } else {
                            stageClass = "stageStepper";
                        }

                        return (
                            <div className="stageContainer">
                                <div onClick={clickedOnUploadFile(index, stageClass, 0)} id="stepperBtn" className={stageClass}>
                                    {index == 0 && <span>Πρωτογενές</span>}
                                    {index == 1 && <span>ΑνάληψΥπο</span>}
                                    {index == 2 && <span>Ανάθεση</span>}
                                    {index == 3 && <span>Σύμβαση</span>}
                                </div>


                                {file.stage !== undefined && <button className="deleteButton" onClick={() => deleteFile(file, expense)}>Delete</button>}
                            </div>
                        )




                    }

                    )
                }
            </div>

            <div className="stagesWithMoreFiles">

                {stageWithMoreFiles.map((files, index) => {
                    console.log(stageWithMoreFiles);
                    return (
                        <div className={index == 0 || moreLess ? "stagesRow" : "stagesRow hide"}>
                            {
                                files.lenght !== 0 && files.map((file, i) => {

                                    let stageClass;
                                    if (file.stage !== undefined) {
                                        if (file.users.length == 0) {
                                            stageClass = "stageStepper";

                                        } else {
                                            let sigedUsers = 0;

                                            file.users.forEach(user => { if (user.signed) sigedUsers++; })


                                            if (sigedUsers !== file.users.length) {
                                                stageClass = "stageStepper stageOrage"
                                            } else {
                                                stageClass = "stageStepper stageGreen"
                                            }
                                        }
                                    } else {
                                        stageClass = "stageStepper";
                                    }


                                    return (

                                        <div className="stageContainer">
                                            <div onClick={clickedOnUploadFile(i + 4, stageClass, index)} id="stepperBtn" className={stageClass}>
                                                {i == 0 && <span>Παραλαβη</span>}
                                                {i == 1 && <span>Ένταλμα</span>}
                                                {i == 2 && <span>Τιμολόγιο</span>}
                                                {i == 3 && <span>Τράπεζα</span>}
                                                {i == 4 && <span>Ασφαλιστική</span>}
                                                {i == 5 && <span>Φορολογική</span>}
                                            </div>


                                            {file.stage !== undefined && <button className="deleteButton" onClick={() => deleteFile(file, expense)}>Delete</button>}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
                )
                }
                <button onClick={addRow} className="addRowButton"><AddIcon /></button>
            </div>
            {

            }
            <button onClick={toggleMoreLess} className="showHideButton" >{!moreLess ? <ExpandMoreIcon /> : <ExpandLessIcon />}</button>
            <FileModal openM={openFileModal} stage={stage} subStage={subStage} expId={expenseId} uploadM={true} />
        </div>
    );
}

export default MainExpensContent;