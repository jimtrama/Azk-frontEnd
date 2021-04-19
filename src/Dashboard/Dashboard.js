import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/Actions';
import './dashboard.css';

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


import MainExpensContent from './MainExpensContent';


import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Avatar, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { OpenInNewTwoTone } from '@material-ui/icons';
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

function CreateExpenseModal() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [nameAlert, setNameAlert] = useState(false);

    useEffect(() => {
        async function run() {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            let res = await fetch(process.env.REACT_APP_BASE_URL + "/projects", requestOptions);
            setProjects(await res.json());

        }
        run();
    }, [])
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [project, setProject] = useState('');
    function SelectProject() {


        const handleChange = (event) => {
            setProject(event.target.value);
        };
        return (
            <FormControl variant="outlined" style={{ minWidth: '120px' }}>
                <InputLabel id="demo-simple-select-outlined-label">Project</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={project}
                    onChange={handleChange}
                    label="Projects"
                >
                    {
                        projects.length > 0 ? projects.map(v => <MenuItem name="ddddd" value={v.name}>{v.name}</MenuItem>) : <></>
                    }

                </Select>
            </FormControl>
        )
    }
    async function createBtnClicked() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        let name = document.getElementById('textboxCreateExpenseName').value;
        let cae = document.getElementById('textboxCreateExpenseCae').value;
        let amount = document.getElementById('textboxCreateExpenseAmount').value;
        let afm = document.getElementById('textboxCreateExpenseAfm').value;
        let provider = document.getElementById('textboxCreateExpenseProvider').value;
        var urlencoded = new URLSearchParams();
        urlencoded.append("name", name);
        urlencoded.append("cae", cae);
        urlencoded.append("active", 1);
        urlencoded.append("amount", amount);
        urlencoded.append("project", project);
        urlencoded.append("afm", afm);
        urlencoded.append("provider", provider);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/newexpense", requestOptions);
        let data = await res.json();
        if (data.error == "name exists") {
            setNameAlert(true);
        } else {
            window.location.reload();
        }


    }
    return (
        <div>
            <button className="createExpenseBtn" onClick={handleOpen}>
                Create New Expense
            </button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className='createExpenseModal'>
                        <h2 id="transition-modal-title">Create An Expense</h2>
                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Name Of Expense:</span>

                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Name Of Expense" id="textboxCreateExpenseName" />
                            </div>

                        </div>
                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Amount Of Expense:</span>
                            <div style={{ width: '50%' }}>
                                <input type="number" placeholder="Amount" id="textboxCreateExpenseAmount" />
                            </div>
                        </div>

                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Cae Of Expense:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Cae" id="textboxCreateExpenseCae" />
                            </div>

                        </div>
                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Name Of Provider:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Provider" id="textboxCreateExpenseProvider" />
                            </div>
                        </div>


                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Afm Of Provider:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Provider's A.F.M." id="textboxCreateExpenseAfm" />
                            </div>
                        </div>

                        <SelectProject />
                        {
                            nameAlert ? <span style={{ color: "red" }}>Name Already Exists</span> : <></>
                        }
                        <button onClick={createBtnClicked}>Create Expense</button>
                        <p id="transition-modal-description">Expense Creation</p>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}

function EditExpenseModal({ expense }) {
    const classes = useStyles();
    const [openEdit, setOpenEdit] = useState(false);
    const [projects, setProjects] = useState([]);
    const [loadedPage, setLoadedPage] = useState(false);
    const [project, setProject] = useState('');
    useEffect(() => {
        async function run() {

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            let res = await fetch(process.env.REACT_APP_BASE_URL + "/projects", requestOptions);
            setProjects(await res.json());
            if (openEdit)
                setLoadedPage(true);
        }
        run();
    }, [openEdit])
    if (loadedPage) {

        document.getElementById('textboxCreateExpenseNameEdit').value = expense.name != undefined ? expense.name : '';
        document.getElementById('textboxCreateExpenseCaeEdit').value = expense.cae != undefined ? expense.cae : '';
        document.getElementById('textboxCreateExpenseAmountEdit').value = expense.amount != undefined ? expense.amount : '';
        document.getElementById('textboxCreateExpenseProviderEdit').value = expense.provider != undefined ? expense.provider : '';
        document.getElementById('textboxCreateExpenseAfmEdit').value = expense.afm != undefined ? expense.afm : '';
        setProject(expense.project)
        setLoadedPage(false);

    }
    const handleOpen = () => {
        setOpenEdit(true);
    };

    const handleClose = () => {
        setOpenEdit(false);
    };

    function SelectProject() {


        const handleChange = (event) => {
            setProject(event.target.value);
        };
        return (
            <FormControl variant="outlined" style={{ minWidth: '120px' }}>
                <InputLabel id="demo-simple-select-outlined-label">Project</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={project}
                    onChange={handleChange}
                    label="Projects"
                >
                    {
                        projects.length > 0 ? projects.map(v => <MenuItem name="ddddd" value={v.name}>{v.name}</MenuItem>) : <></>
                    }

                </Select>
            </FormControl>
        )
    }
    async function editBtnClicked() {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        let name = document.getElementById('textboxCreateExpenseNameEdit').value;
        let cae = document.getElementById('textboxCreateExpenseCaeEdit').value;
        let amount = document.getElementById('textboxCreateExpenseAmountEdit').value;
        let provider = document.getElementById('textboxCreateExpenseProviderEdit').value;
        let afm = document.getElementById('textboxCreateExpenseAfmEdit').value;

        var urlencoded = new URLSearchParams();
        console.log(expense);
        urlencoded.append("name", name);
        urlencoded.append("cae", cae);
        urlencoded.append("active", 1);
        urlencoded.append("amount", amount);
        urlencoded.append("project", project);
        urlencoded.append("provider", provider);
        urlencoded.append("afm", afm);
        urlencoded.append("expId", expense._id);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/editexpense", requestOptions);
        let data = await res.json();
        console.log(data);
        window.location.reload();

    }
    return (
        <div>
            <button onClick={handleOpen}>
                <EditIcon />
            </button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openEdit}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openEdit}>
                    <div className='createExpenseModal'>
                        <h2 id="transition-modal-title">Edit An Expense</h2>
                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Name Of Expense:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Name Of Expense" id="textboxCreateExpenseNameEdit" />
                            </div>
                        </div>


                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Amount Of Expense:</span>
                            <div style={{ width: '50%' }}>
                                <input type="number" placeholder="Amount" id="textboxCreateExpenseAmountEdit" />
                            </div>
                        </div>


                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Cae Of Expense:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Cae" id="textboxCreateExpenseCaeEdit" />
                            </div>
                        </div>


                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Name Of Provider:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Provider" id="textboxCreateExpenseProviderEdit" />
                            </div>
                        </div>


                        <div style={{ display: "flex" }}>
                            <span style={{ width: "50%" }}>Afm Of Provider:</span>
                            <div style={{ width: '50%' }}>
                                <input type="text" placeholder="Provider's A.F.M." id="textboxCreateExpenseAfmEdit" />
                            </div>
                        </div>

                        <SelectProject />
                        <button onClick={editBtnClicked}>Edit Expense</button>
                        <p id="transition-modal-description">Expense Edit</p>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
function ExpenseComp({ expense, filesForOne, filesForTwo, amount }) {



    return (
        <div className="expenseContainer">

            <div className="expenseHeader">
                <EditExpenseModal expense={expense} />
                <span className="expenseTitle">{expense.name}</span>
                <span className="expenseCae">{expense.cae}</span>
                <div>
                    <span className="expenseAmount">{amount}</span>
                    <span className="expenseAmount">/{expense.amount + "$"}</span>
                </div>
                <span className="expenseAmount">{expense.provider}</span>
                <span className="expenseAmount">{expense.afm}</span>
                <span className="expenseAmount">{expense.project}</span>
                <span className="expenseDate">{expense.createdAt.split("T")[0].split("-").map((v, i, a) => i === a.length - 1 ? a[0] : a[2 - i] + "/")}</span>
            </div>
            <MainExpensContent expense={expense} stageWithOneFileMain={filesForOne} stageWithMoreFilesMain={filesForTwo} expenseId={expense._id} />
        </div>
    )
}




function Dashboard({ history }) {

    let user = useSelector(state => state.persistedStore);
    const [expensesFromDb, setExpensesFromDb] = useState([])
    const [loadedDatafromDb, setLoadedDatafromDb] = useState(false);
    const dispatch = useDispatch();
    const [amounts, setLaodAmounts] = useState([]);
    const [avatar, setAvatar] = useState(null);
    useEffect(() => {

        console.log("g");
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
                headers: {
                    "avatar": encodeURIComponent(user.avatar, 'utf-8')
                },
                redirect: 'follow'
            };
            let resAvatar = await fetch(process.env.REACT_APP_BASE_URL + "/userimg", requestOptions);
            let dataAvatar = new Uint8Array(await resAvatar.arrayBuffer());

            setAvatar(URL.createObjectURL(new Blob([dataAvatar], { type: 'image/png' })));
            setExpensesFromDb(data.reverse());
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
                        Dashboard
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
                    <ListItem button onClick={() => { history.replace("/expenses") }} >
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Expenses" />
                    </ListItem>
                    {
                        user.username == 'diordanidou' &&
                        <>
                            <ListItem button >
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
                <CreateExpenseModal />
                {!expensesFromDb.some(v => v.name == undefined ? true : false) &&
                    expensesFromDb.map((expense) => {
                        let amountForexpense = 0;

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

                        return (<ExpenseComp expense={expense} filesForTwo={filesForTwo} filesForOne={filesForOne} amount={amountForexpense} />)
                    })
                }


            </main>
        </div>



    );
}

export default Dashboard;


