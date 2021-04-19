import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/Actions';
import './../Dashboard/dashboard.css';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GreenTick from './../Images/greentick.png'
import RedTick from './../Images/redcross.png'

import MainExpensContent from './MainExpensContent';

import './expensesPage.css'

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Avatar, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import Image from './../azk.png'

const useStylesDrawer = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },

}));

const drawerWidth = 240;

function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}



const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));







function Dashboard({ history }) {

    let user = useSelector(state => state.persistedStore);
    const [expensesFromDb, setExpensesFromDb] = useState([]);
    const [expensesToShow, setExpensesToShow] = useState([]);
    const [loadedDatafromDb, setLoadedDatafromDb] = useState(false);
    //const [titleSearch, setTitleSearch] = useState('');
    const dispatch = useDispatch();
    const [amounts, setLaodAmounts] = useState([]);
    const refresh = useForceUpdate();
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState("None");
    const [avatar, setAvatar] = useState(null);
    let projectSearchTemp = "None"
    function Search(e) {
        if (e.target.name == "projectsSearch") {
            if (e.target.value) {
                setProject(e.target.value);
                projectSearchTemp = e.target.value;

            }
        }
        let titleSearch = document.getElementById('expenseNameSearch').value;
        let caeSearch = document.getElementById('expenseCaeSearch').value;
        let partnerSearch = document.getElementById('expensePartnerSearch').value;
        let afmSearch = document.getElementById('expenseAfmSearch').value;
        let searchValues = [{ "name": titleSearch }, { "cae": caeSearch }, { "provider": partnerSearch }, { "afm": afmSearch }];

        let temp = [];
        for (let i = 0; i < expensesFromDb.length; i++) {
            const expense = expensesFromDb[i];
            if (projectSearchTemp && projectSearchTemp != "None") {

                if (expense.name.includes(titleSearch) && expense.cae.includes(caeSearch) && expense.provider.includes(partnerSearch) && expense.afm.toString().includes(afmSearch) && expense.project.includes(projectSearchTemp))
                    temp.push(expense)
            } else {
                if (expense.name.includes(titleSearch) && expense.cae.includes(caeSearch) && expense.provider.includes(partnerSearch) && expense.afm.toString().includes(afmSearch))
                    temp.push(expense)
            }

        }

        setExpensesToShow(temp.reverse());

        refresh();

    }

    useEffect(() => {

        console.log("effect");
        async function load() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            let res = await fetch(process.env.REACT_APP_BASE_URL + "/expenses", requestOptions);
            let data = await res.json();

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            let resAmount = await fetch(process.env.REACT_APP_BASE_URL + "/fileamount", requestOptions);
            let dataAmount = await resAmount.json();

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            let resPr = await fetch(process.env.REACT_APP_BASE_URL + "/projects", requestOptions);
            var requestOptions = {
                method: 'GET',
                headers: {
                    "avatar": encodeURIComponent(user.avatar, 'utf-8')
                },
                redirect: 'follow'
            };
            let resAvatar = await fetch(process.env.REACT_APP_BASE_URL + "/userimg", requestOptions);
            let dataAvatar = new Uint8Array(await resAvatar.arrayBuffer());

            setAvatar(URL.createObjectURL(new Blob([dataAvatar], { type: 'image/png' })));
            setProjects(await resPr.json());

            setExpensesFromDb(data);
            setExpensesToShow(data.reverse());
            setLaodAmounts(dataAmount);
            setLoadedDatafromDb(true);
        }

        if (!loadedDatafromDb) {
            load();
        }

    }, [])





    function logout() {
        dispatch(updateUser({}));
        history.replace('/');
    }





    const classes = useStylesDrawer();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    function SignsModal({ expenseid, expenseName }) {
        const [openSignsModal, setOpenSignsModal] = useState(false);
        const [fileChoseStage, setFileChoseStage] = useState(-1)
        const [fileChoseSubStage, setFileChoseSubStage] = useState(0)
        const [data, setData] = useState([]);
        function ChangeChoise(e) {
            setFileChoseStage(e.target.value)
        }
        function ChangeChoiseSub(e) {
            setFileChoseSubStage(e.target.value)
        }

        async function searchFile() {
            console.log(expenseid, expenseName);
            if (fileChoseStage != -1) {
                let res = await fetch(process.env.REACT_APP_BASE_URL + "/whosigned", { method: "GET", headers: { expenseid, "stage": fileChoseStage, "substage": fileChoseSubStage } })
                let r = await res.json()
                setData(r.data);
            }


        }


        return (
            <>
                <button className="serarchFileBtnModal" onClick={() => { setOpenSignsModal(true) }}>Signs</button>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                    open={openSignsModal}
                    onClose={() => { setOpenSignsModal(false) }}
                >
                    <div className="signsModalContainer">
                        <div className="signsModalContainerFilters">
                            <FormControl variant="outlined" >
                                <InputLabel id="demo-simple-select-outlined-label">Stage</InputLabel>
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={fileChoseStage}
                                    onChange={ChangeChoise}
                                    label="Projects"
                                    name="projectsSearch"
                                >
                                    <MenuItem value={-1}>None</MenuItem>
                                    <MenuItem value={0}>Πρωτογενές</MenuItem>
                                    <MenuItem value={1}>ΑνάληψΥπο</MenuItem>
                                    <MenuItem value={2}>Ανάθεση</MenuItem>
                                    <MenuItem value={3}>Σύμβαση</MenuItem>
                                    <MenuItem value={4}>Παραλαβη</MenuItem>
                                    <MenuItem value={5}>Ένταλμα</MenuItem>
                                    <MenuItem value={6}>Τιμολόγιο</MenuItem>
                                    <MenuItem value={7}>Τράπεζα</MenuItem>
                                    <MenuItem value={8}>Ασφαλιστική</MenuItem>
                                    <MenuItem value={9}>Φορολογική</MenuItem>

                                </Select>
                            </FormControl>
                            {
                                fileChoseStage >= 4 &&
                                <FormControl variant="outlined" >
                                    <InputLabel id="demo-simple-select-outlined-label">SUB Stage</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={fileChoseSubStage}
                                        onChange={ChangeChoiseSub}
                                        label="Projects"
                                        name="projectsSearch"
                                    >

                                        <MenuItem value={0}>1</MenuItem>
                                        <MenuItem value={1}>2</MenuItem>
                                        <MenuItem value={2}>3</MenuItem>
                                        <MenuItem value={3}>4</MenuItem>
                                        <MenuItem value={4}>5</MenuItem>
                                        <MenuItem value={5}>6</MenuItem>
                                        <MenuItem value={6}>7</MenuItem>
                                        <MenuItem value={7}>8</MenuItem>
                                        <MenuItem value={8}>9</MenuItem>
                                        <MenuItem value={9}>10</MenuItem>

                                    </Select>
                                </FormControl>
                            }
                            <button className="serarchFileBtn" onClick={searchFile}>Search</button>
                        </div>
                        <div className="whoSigedModalContainerUsers">
                            {
                                data.map(user => {
                                    console.log(user.signed);
                                    return (
                                        <div className="whoSignedRow">
                                            <span className="nameUserSignedOrNot">{user.username}</span>
                                            <div className="imgUsersSigned">
                                                <img src={user.signed ? GreenTick : RedTick} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                </Modal>
            </>
        )
    }
    return (

        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Expenses
                    </Typography>
                    <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                        <img style={{ height: "100px" }} src={Image}></img>
                    </div>
                    <div className="headerContainer">
                        <span >{user.username}</span>

                        <Avatar src={avatar} />
                        <button onClick={logout}>logout</button>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button onClick={() => { history.replace("/signing") }} >
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Signing" />
                    </ListItem>
                    <ListItem button  >
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Expenses" />
                    </ListItem>
                    {
                        user.username == 'diordanidou' &&
                        <>
                            <ListItem button onClick={() => { history.replace("/dash") }} >
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                            <ListItem button onClick={() => { history.replace("/projects") }} >
                                <ListItemIcon><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Projects" />
                            </ListItem>
                        </>
                    }





                </List>
                <Divider />
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >

                <div className={classes.drawerHeader} />
                <div className="searchExpenseContainer">
                    <input className="searchBoxExpenses" placeholder="Expense Name ..." id="expenseNameSearch" onChange={Search} />
                    <input className="searchBoxExpenses" placeholder="Expense Cae ..." id="expenseCaeSearch" onChange={Search} />
                    <input className="searchBoxExpenses" placeholder="Expense Partner ..." id="expensePartnerSearch" onChange={Search} />
                    <input className="searchBoxExpenses" placeholder="Expense Afm ..." id="expenseAfmSearch" onChange={Search} />
                    <FormControl variant="outlined" >
                        <InputLabel id="demo-simple-select-outlined-label">Project</InputLabel>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={project}
                            onChange={Search}
                            label="Projects"
                            name="projectsSearch"
                        >
                            <MenuItem name="ddddd" value="None">None</MenuItem>
                            {

                                projects.length > 0 ? projects.map(v => <MenuItem name="ddddd" value={v.name}>{v.name}</MenuItem>) : <></>
                            }
                        </Select>
                    </FormControl>

                </div>
                {!expensesToShow.some(v => v.name == undefined ? true : false) &&
                    expensesToShow.map((expense) => {
                        let amountForexpense = 0;
                        console.log(amounts);
                        amounts.forEach(expenseA => {
                            if (expenseA.id === expense._id) {
                                amountForexpense = expenseA.amount;
                            }
                        })


                        let stageOneFile = expense.files[0];
                        let stageMoreFile = expense.files[1];

                        let filesForOne = [{}, {}, {}, {}];
                        let filesForTwo = [[{}, {}, {}, {}, {}, {}]];

                        if (stageOneFile != undefined) {
                            stageOneFile.forEach((file) => {
                                filesForOne[file.stage] = file;
                            })
                        }


                        if (stageMoreFile != undefined) {
                            stageMoreFile.map((arrayOfFiles, i) => {
                                filesForTwo[i] = Array(6).fill({});
                                if (arrayOfFiles.length != 0) {

                                    arrayOfFiles.map((file) => {
                                        filesForTwo[i][file.stage - 4] = file
                                    })
                                }

                            })
                        }
                        console.log(expense._id);
                        return (<div className="expenseContainer">
                            <div className="expenseHeader">
                                <SignsModal expenseid={expense._id} expenseName={expense.name} />
                                <span className="expenseTitle">{expense.name}</span>
                                <span className="expenseCae">{expense.cae}</span>
                                <div>
                                    <span className="expenseAmount">{amountForexpense}</span>
                                    <span className="expenseAmount">/{expense.amount + "$"}</span>
                                </div>
                                <span className="expenseAmount">{expense.provider}</span>
                                <span className="expenseAmount">{expense.afm}</span>
                                <span className="expenseAmount">{expense.project}</span>
                                <span className="expenseDate">{expense.createdAt.split("T")[0].split("-").map((v, i, a) => i === a.length - 1 ? a[0] : a[2 - i] + "/")}</span>
                            </div>
                            <MainExpensContent expense={expense} stageWithOneFileMain={filesForOne} stageWithMoreFilesMain={filesForTwo} expenseId={expense._id} />
                        </div>)
                    })
                }


            </main>
        </div >



    );
}

export default Dashboard;


