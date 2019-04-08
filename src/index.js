import * as React from 'react';
import {render} from 'react-dom';
// import Accounts from './Accounts';
import { HashRouter,Switch ,Route} from "react-router-dom";
import indexRoutes from "./routes/index.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard.css?v=1.2.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";

// import './index.css';
import InstallMetaMask from "./InstallMetaMask"
import registerServiceWorker from './registerServiceWorker';
import Web3 from "web3"
let web3

const App = () => {
    // Detect if Web3 is found, if not, ask the user to install Metamask
    if (window.web3) {
        web3 = new Web3(window.web3.currentProvider)
        // const c = (window as any).compiler
        return (
            <HashRouter>
                <Switch>
                    {/*<Route path="/" render={(props)=><Accounts {...props} web3={web3} />} />*/}
                    {/*<Provider web3={web3}/>*/}
                    {/*<Route to="/bet" render={(props)=> <Subscriber {...props} web3={web3}/>} />*/}
                    {indexRoutes.map((prop,key)=>{
                        return <Route path={prop.path} component={prop.component} key={key}/>
                    })}
                </Switch>
            </HashRouter>
        );
    } else {
        return <InstallMetaMask />;
    }
};

render(<App />, document.getElementById('root')
);
registerServiceWorker();
