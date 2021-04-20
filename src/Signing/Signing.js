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


import MainExpensContent from './MainExpensContent';


import { Avatar } from '@material-ui/core';
import Image from './../azk.png';

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

    }

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



function ExpenseComp({ expense, filesForOne, filesForTwo, amount }) {



    return (
        <div className="expenseContainer">
            <div className="expenseHeader">
                <span className="expenseTitle">{expense.name}</span>
                <span className="expenseCae">{expense.cae}</span>
                <div>
                    <span className="expenseAmount">{amount}</span>
                    <span className="expenseAmount">/{expense.amount + "€"}</span>
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


        async function load() {
            let myHeaders = new Headers();
            myHeaders.append('name', user.username);
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };
            let res = await fetch(process.env.REACT_APP_BASE_URL + "/expensestosign", requestOptions);
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
                        Signing
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
                    <ListItem button  >
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
                            <ListItem button onClick={() => { history.replace("/dash") }}>
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

                {!expensesFromDb.some(v => v.name == undefined ? true : false) &&
                    expensesFromDb.length == 0 ? (<span style={{ fontSize: "1.5rem" }}>No Files to sign for now.</span>) :
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


