import * as _ from 'lodash';
import * as React from 'react';
import {debuglog} from "util";
import  Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button} from "reactstrap"

interface Props {
    web3: Web3
}

interface EthBalance {
    coin:any
    balance: any;
}

export default class Account extends React.Component<Props, {}> {
    public state = { accounts: [''], balances: {} };
    // private _pollingIntervalId: any;
    constructor(props: Props) {
        super(props);

        // Poll for the account details and keep it refreshed
        // this._pollingIntervalId = setInterval(() => {
        //     this.fetchAccountDetailsAsync();
        // }, 3000);
    }

    public fetchAccountDetailsAsync = async () => {
        const addresses : string[] = await this.props.web3.eth.getAccounts()
        const balances : {[index:string]:EthBalance} = {};
            // Fetch all the Balances for all of the tokens in the Token Registry
            for (const address of addresses) {
                try {
                    const numberBalance:any = await this.props.web3.eth.getBalance(address, "latest")
                    balances[address] = {coin: "ETH", balance: numberBalance};
                } catch (e) {
                    debuglog(e)
                    balances[address] = {coin: "ETH", balance: '0'};
                }
            }

            // Update the state in React
            this.setState((prev, props) => {
                return {...prev, balances, accounts: addresses};
            });
    };

    public render() {
        const account = this.state.accounts;
        const balances = this.state.balances
        if (Object.keys(balances).length>0) {
            const accountString = `${account}`;

            const balancesString = _.map(balances, (v: any, k: string|number) => {
                const pairString = `${k}:\n Coin : ${v.coin}\n Balance: ${v.balance}`;
                return <p key={k}>{pairString}</p>;
            });
            return (
                <div>
                    <p>
                        <strong>Account</strong> {accountString}
                    </p>
                    <strong> Balances </strong>
                    {balancesString}
                </div>
            );
        } else {
            return (
                <div>
                    <p> Detecting Metamask... Please ensure Metamask is unlocked </p>
                    <Button id="fetchAccountBalances" onClick={this.fetchAccountDetailsAsync}>
                        Fetch Balances
                    </Button>
                </div>
            );
        }
    }
}
