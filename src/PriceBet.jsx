import {ZapSubscriber} from "@zapjs/subscriber";
import * as React from "react";
import * as priceBet from "./json/priceBet.json"
import MakeBet from "makeBet.jsx"
import TakeBet from "./takeBet"
import Settle from "./Settle"
import {WalletCard} from "components/Wallet/WalletCard.jsx"
import {
    Grid,
    Row,
    Col,
    FormGroup,
    ControlLabel,
    FormControl
} from "react-bootstrap";
import * as Web3 from "web3"

import Provider from "./Provider"
import Accounts from "./Accounts";


export default class PriceBet extends React.Component{
    betInfo
    state = {
        betInfo: {},
        contractAbi:'',
        error:'',
        owner: '',
        subscriber: ZapSubscriber,
        txid:''
    };

    constructor(props) {
        super(props);
        this.web3 = new Web3(window.web3.currentProvider)
    }


    transactionCompleted = (txid)=>{
        this.setState({txid})
        this.forceUpdate()
    }


    render(){
        const components = [(<h4 className="title text-center"></h4>)]
            components.push(<MakeBet web3={this.web3} betInfo = {this.betInfo} account={this.state.owner} transactionCompleted={this.transactionCompleted}/>)
            return (
                <div className="wrapper">
                    <Grid fluid>
                      <Row xs={12}>
                      <Col xs={12} md={8}>
                        <Provider web3={this.web3}/>
                      </Col>
                        <Col xs={12} md={4}>
                          <Accounts web3={this.web3}/>
                        </Col>
                      </Row>
                      <Row xs={12}>
                        <Col xs={12} md={12}>
                        {components}
                        </Col>
                      </Row>
                    </Grid>>
                </div>
            )
        }
    //}

}