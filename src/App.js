import { HashRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard'
import Login from './Login/Login'
import Project from './Project/Project'
import Admin from './Admin/Admin'
import ExpenceView from './Expenses/ExpensesView'
import Signing from './Signing/Signing'
import { useEffect } from 'react';
import { useState } from 'react';


function App() {
    
    
    return (

        <HashRouter basename="/">
            <div className="App">
                <Switch>
                    <Route exact path="/dash" component={Dashboard} />
                    <Route exact path="/projects" component={Project} />
                    <Route exact path="/expenses" component={ExpenceView} />
                    <Route exact path="/" component={Login} />
                    <Route exact path="/admin" component={Admin} />
                    <Route exact path="/signing" component={Signing} />
                </Switch>
            </div>
        </HashRouter>


    )
}

export default App;
