import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './../Dashboard/dashboard.css';
import { Checkbox, CircularProgress, FormControl, MenuItem, Select, InputLabel } from '@material-ui/core';
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
import './../Dashboard/pdfviewers.css'
import './../Signing/signing.css'

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
    const updateComponent = useForceUpdate();
    console.log(stageWithMoreFiles);
    useEffect(() => {
        setStageWithOneFile(stageWithOneFileMain);
        setStageWithMoreFiles(stageWithMoreFilesMain);
        setCheckedFOrOne([[], [], [], []]);
        setCheckedForMore([[], [], [], [], [], [], [], [], [], [], [], []]);
        console.log(stageWithMoreFiles);
    }, [expense])
    useEffect(() => {
        console.log(stageWithMoreFiles);
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

    }, [stageWithOneFile, stageWithMoreFiles])

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
                if (openFileModal) {
                    let path = "";
                    if (stage >= 4 && expense.files[1]) {
                        expense.files[1].forEach((arrayfiles) => {
                            arrayfiles.forEach(file => {
                                if (file.stage == stage && file.substage == subStage) {
                                    path = file.path;
                                    setFileId(file.fileId);
                                }
                            })

                        })
                    } else if (expense.files[0]) {
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

            }



            loadPdf();



        }, [])



        const handleClose = () => {
            setOpenFileModal(false);
        };







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



                    }







                </Modal>
            </div >
        );
    }




    const openModal = (stageV, cssClass, substage) => () => {
        if (cssClass.includes('stageOrageSigning') || cssClass.includes('stageGreenSigning')) {
            setStage(stageV)
            setSubStage(substage)
            setOpenFileModal(true);
        }

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
                        console.log(file);
                        if (file.stage === index) {
                            if (file.users.length == 0) {
                                stageClass = "stageStepperSigning";

                            } else {
                                let sigedUsers = 0;

                                file.users.forEach(user => { if (user.signed) sigedUsers++; })


                                if (sigedUsers !== file.users.length) {
                                    stageClass = "stageStepperSigning stageOrageSigning"
                                } else {
                                    stageClass = "stageStepperSigning stageGreenSigning"
                                }
                            }
                        } else {
                            stageClass = "stageStepperSigning";
                        }

                        return (
                            <div className="stageContainer">
                                <div onClick={openModal(index, stageClass, 0)} id="stepperBtn" className={stageClass}>
                                    {index == 0 && <span>Πρωτογενές</span>}
                                    {index == 1 && <span>ΑνάληψΥπο</span>}
                                    {index == 2 && <span>Ανάθεση</span>}
                                    {index == 3 && <span>Σύμβαση</span>}
                                </div>
                                

                            </div>
                        )




                    })
                }
            </div>

            <div className="stagesWithMoreFiles">

                {stageWithMoreFiles.map((files, index) => {
                    
                    return (
                        <div className={index == 0 || moreLess ? "stagesRow" : "stagesRow hide"}>
                            {
                                files.lenght !== 0 && files.map((file, i) => {

                                    let stageClass;
                                    if (file.stage !== undefined) {
                                        if (file.users.length == 0) {
                                            stageClass = "stageStepperSigning";

                                        } else {
                                            let sigedUsers = 0;

                                            file.users.forEach(user => { if (user.signed) sigedUsers++; })


                                            if (sigedUsers !== file.users.length) {
                                                stageClass = "stageStepperSigning stageOrageSigning"
                                            } else {
                                                stageClass = "stageStepperSigning stageGreenSigning"
                                            }
                                        }
                                    } else {
                                        stageClass = "stageStepperSigning";
                                    }


                                    return (

                                        <div className="stageContainer">
                                            <div onClick={openModal(i + 4, stageClass, index)} id="stepperBtn" className={stageClass}>
                                                {i == 0 && <span>Παραλαβη</span>}
                                                {i == 1 && <span>Ένταλμα</span>}
                                                {i == 2 && <span>Τιμολόγιο</span>}
                                                {i == 3 && <span>Τράπεζα</span>}
                                                {i == 4 && <span>Ασφαλιστική</span>}
                                                {i == 5 && <span>Φορολογική</span>}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
                )
                }

            </div>
            {

            }
            <button onClick={toggleMoreLess} className="showHideButton" >{!moreLess ? <ExpandMoreIcon /> : <ExpandLessIcon />}</button>
            <FileModal openM={openFileModal} stage={stage} subStage={subStage} expId={expenseId} uploadM={true} />
        </div>
    );
}

export default MainExpensContent;