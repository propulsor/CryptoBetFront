import * as React from "react";
import * as Web3 from "web3"
import { Row,  FormGroup, ControlLabel, FormControl,Alert} from "react-bootstrap";
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import {Card} from "./components/Card/Card";
import Button from "./components/CustomButton/CustomButton";
import {ZapToken} from "@zapjs/zaptoken"
import {toBN} from "web3-utils"

const mnemonic = "solid giraffe crowd become skin deliver screen receive balcony ask manual current"; //kovan testnet owners for all zap contracts
const HDWalletProviderMem = require("truffle-hdwallet-provider");
const KOVAN_URL = "https://kovan.infura.io"
const LoaderCentered = () => <Loader active inline='centered' />


export default class Faucet extends React.Component {

  state = {
   address:'',
    txid: undefined,
    show:false,
    waiting:false
  }

  // private _pollingIntervalId: any;
  constructor(props){
    super(props);
    this.web3 = new Web3(new HDWalletProviderMem(mnemonic, KOVAN_URL));
    this.onChange=this.onChange.bind(this)
    this.onSubmit=this.onSubmit.bind(this)

  }

  onChange(event){
    this.setState({address:event.target.value})
  }

  async onSubmit(event){
    this.setState({waiting:true})
    const accounts = await this.web3.eth.getAccounts();
    const owner = accounts[0];
    console.log("owner : ", owner)

    const options= {
        networkId: 42,
      networkProvider: this.web3.currentProvider,
      owner: owner
  };
    const token = new ZapToken(options);
    console.log("Starting faucet : ")
    // fund the faucet
    let tx = await token.allocate({to: this.state.address, amount: toBN(1e18).imul(toBN(1000)), from: owner})
    console.log('Allocation to Faucet, Hash:', tx)
    let txid = tx.transactionHash
    this.setState({txid,show:true,waiting:false})
  }

  handleClose(){
    this.setState({show:false})
  }

  render() {
    let noti =[<p></p>]
    if(this.state.txid && this.state.show){
      console.log("get here", this.state.txid, this.state.show)
      let etherscan = "https://kovan.etherscan.io/tx/" +this.state.txid;
      let link = (<a href={etherscan}>{etherscan}</a>)
      noti.push(
        <Alert bsStyle="success">
        <button type="button" aria-hidden="true" className="close" onClick={this.handleClose}>
          &#x2715;
        </button>
        <span>
            <b> Success - </b>
          {link}
          </span>
      </Alert>)
    }
    let wait=[<p></p>]
    if(this.state.waiting){
      console.log("Waiting:" , this.state.waiting)
      wait.push(
        <div>
        <p>Sending Zap...</p>
        </div>
      )
    }
    return(
      <div className='wrapper'>
      <Card
        title="Zap Kovan Faucet"
        content={
          <form>
            <Row>
              <div key={0} className="col-md-5">
                <FormGroup>
                  <ControlLabel>Enter Address to receive Zap</ControlLabel>
                  <FormControl
                    type="text"
                    bsClass="form-control"
                    value={this.state.address}
                    name='Address'
                    onChange={this.onChange}
                  >
                  </FormControl>
                </FormGroup>
              </div>
            </Row>
            <Row>
            {wait}
            </Row>
            <Row>
              {noti}
            </Row>
            <Button bsStyle="info" pullLeft fill type="submit" onClick={this.onSubmit}>
              Submit
            </Button>
          </form>
        }
          />
      </div>
    )
  }

}