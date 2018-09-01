import {ZapSubscriber} from "@zapjs/subscriber";
import * as React from "react";
import * as priceBet from "./json/priceBet.json"
import MakeBet from "makeBet.jsx"
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
        if(!window.web3.isConnected){
          alert("Meta mask not connected")
        }
        if(!window.web3.currentProvider.isMetaMask){
          alert("MetaMask provider not found")
        }
        this.web3 = new Web3(window.web3.currentProvider)
    }


    transactionCompleted = (txid)=>{
        this.setState({txid})
        this.forceUpdate()
    }


    render(){
        const components = [(<h4 className="title text-center"></h4>)]
            components.push(<MakeBet web3={this.web3} transactionCompleted={this.transactionCompleted}/>)
            if(this.state.txid){
              components.push(<p> txid : {this.state.txid}</p>)
            }
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