import * as React from 'react';
import {render} from 'react-dom';
import Accounts from './Accounts';
import './index.css';
import InstallMetaMask from "./InstallMetaMask"
import registerServiceWorker from './registerServiceWorker';
import Web3 from "web3"
// import Provider from "./Provider"
import Subscriber from "./PriceBet";
let web3:Web3

const App = () => {
    // Detect if Web3 is found, if not, ask the user to install Metamask
    if ((window as any).web3) {
        web3 = new Web3((window as any).web3.currentProvider)
        // const c = (window as any).compiler
        return (
            <div>
                <h3>Welcome to Zap Oracle Crypto Price Betting Demo</h3>
                <Accounts web3={web3} />
                {/*<Provider web3={web3}/>*/}
                <Subscriber web3={web3} />
            </div>
        );
    } else {
        return <InstallMetaMask />;
    }
};

render(<App />, document.getElementById('root') as HTMLElement
);
registerServiceWorker();
