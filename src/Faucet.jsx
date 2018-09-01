import {ZapProvider} from "@zapjs/provider";
import * as React from "react";
import {oracle} from "./config";
import * as Web3 from "web3"
import {EndpointCard} from "components/Provider/Endpointcard.jsx"
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import {Card} from "./components/Card/Card";



export default class Faucet extends React.Component {
  state = {
    accounts:[''],
    curve:[''],
    endpoints:{},
    init:false,
    provider:ZapProvider,
    pubkey:'',
    title:'',
    providerOwner:''
  }

  // private _pollingIntervalId: any;
  constructor(props){
    super(props);
    if(!window.web3 || !window.web3.currentProvider.isMetaMask){
      alert("MetaMask not found")
    }
    this.web3 = new Web3(window.web3.currentProvider)
  }
  getProviderAsync = async()=>{
    let init=false;
    let title;
    let curve
    let pubkey, endpoints = {}
    const accounts = await this.web3.eth.getAccounts()
    const providerOwner = oracle.address
    const provider = new ZapProvider(providerOwner,{
      networkId:42,
      networkProvider: this.web3
    })
    init = await provider.isProviderInitialized()
    if(init){
      title = await provider.getTitle()
      pubkey = await provider.getPubkey()
      let es = await provider.zapRegistry.getProviderEndpoints(providerOwner)
      for(let e of es){
        let c = await provider.getCurve(e)
        console.log(c)
        endpoints[e] = c.values
      }
      //curve = await provider.getCurve(endpoint)
      // console.log(curve)
      // curve = curve.join(" | ")
      init=true
      return this.setState((prev,props)=>{
        return {...prev,accounts,curve,init,provider,pubkey, title,providerOwner,endpoints}
      })
    }
    else{
      return this.setState((prev,props)=>{
        return {...prev,accounts,init,provider}
      })
    }
  }


  render() {
    return(
      <Card
        title="Current Bet"
        content={
          <form>
            <Row>
              <div key={0} className="col-md-5">
                <FormGroup>
                  <ControlLabel>Coin</ControlLabel>
                  <FormControl
                    type="option"
                    componentClass="select"
                    bsClass="form-control"
                    value={this.state.coin}
                    defaultValue={!!this.state.coin ? this.state.coin :  "BTC"}
                    name='coin'
                    onChange={this.onSelect}
                    disabled={parseInt(this.state.step)===0 ? "false": "true"}
                  >
                    <option>Select...</option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </FormControl>
                </FormGroup>
              </div>
            </Row>
          </form>
    )
  }

}