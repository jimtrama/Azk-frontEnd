import React, { useEffect, useState } from 'react'

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
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { updateUser } from '../store/Actions';
import './project.css'
import Image from './../azk.png'

const useStyles = makeStyles((theme) => ({
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



function Project({ history }) {
    let user = useSelector(state => state.persistedStore);
    console.log(user);
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [projects, setProjects] = useState([]);
    const [avatar,setAvatar]=useState(null);
    useEffect(() => {
        const load = async () => {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            let res = await fetch(process.env.REACT_APP_BASE_URL + "/projects", requestOptions);
            let data = await res.json();
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
            setProjects(data.reverse());
        }
        load();

    }, [])
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    function logout() {
        dispatch(updateUser({}));
        history.replace('/');
    }
    const handleDrawerClose = () => {
        setOpen(false);
    };
    async function createProject() {
        let projectName = document.getElementById('project').value;
        if (projectName === undefined || projectName === null) {
            console.log("project name can't be empty");
            return;
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("name", projectName);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/newproject", requestOptions);
        let data = await res.json();
        if (data.success) {
            window.location.reload();
        } else {
            console.log(data);
        }
    }
    async function deleteProject(i) {
        var myHeaders = new Headers();
        console.log(i);
        myHeaders.append("projectid", i);



        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        let res = await fetch(process.env.REACT_APP_BASE_URL + "/deleteproject", requestOptions);
        let data = await res.json();
        if (data.success) {
            window.location.reload();
        } else {
            console.log(data);
        }
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
                        AZK Projects
          </Typography>
          <div style={{marginLeft:"auto",marginRight:"auto"}}>
                        <img style={{height:"100px"}} src={Image}></img>
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
                    <ListItem button onClick={() => { history.replace("/dash") }}>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItem>
                    
                   

                </List>
                <Divider />
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <div className="createProjectcontainer">
                    <input placeholder="Name of Project" id="project" />
                    <button onClick={createProject} className="createProjectButton">Create Project</button>
                </div>
                <div className="projectsContainer">
                    {
                        projects.map(project => {
                            console.log(project);
                            return (
                                <div className="projectContainer">
                                    <span>{project.name}</span>
                                    <button onClick={() => { deleteProject(project._id) }} className="deleteProjectButton">Delete Project</button>
                                </div>
                            )
                        })
                    }
                </div>

            </main>
        </div>
        



    );

}

export default Project
