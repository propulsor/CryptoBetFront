import * as React from "react";
import  {toBN} from 'web3-utils'
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { FormGroup, ControlLabel, FormControl, Row } from "react-bootstrap";
import * as priceBet from "./json/priceBet";
import * as Web3 from "web3"
import {ZapSubscriber} from "@zapjs/subscriber"
import {ZapBondage} from "@zapjs/bondage";
import {oracle} from "./config";
const steps = ['Make Bet', 'Take Bet', 'Settle']


// interface Props {
//     betInfo:any,
//     account:string,
//     transactionCompleted:any
// }
export default class MakeBet extends React.Component{
   state = {
       coin:"BTC",
       price:0,
       side:'higher',
       expire:0, // minutes
       txid:'',
     player1: '',
     player2: '',
     amount: 0,
     step:undefined
   }
   betInfo = {}
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }


  settle = async()=>{
    // approve, bond, query
    const subscriber = new ZapSubscriber(this.state.owner,{networkId: 42,networkProvider: this.props.web3})
    const zapBondage = new ZapBondage({networkId: 42,networkProvider: this.props.web3})
    const zapRequire = await zapBondage.calcZapForDots({
      dots:1,
      endpoint:oracle.endpoint,
      provider:oracle.address
    })
    subscriber.zapToken.approve({amount:zapRequire,from:this.state.owner,to:subscriber.zapBondage.contract.options.address})
    await subscriber.zapBondage.delegateBond({
      dots:1,
      endpoint:oracle.endpoint,
      from:this.state.owner,
      provider:oracle.address,
      subscriber:this.betInfo.contract.options.address,
    })
    const transaction = await this.betInfo.contract.methods.queryProvider()
      .send({from:this.state.owner,gas:6000000})
    this.props.transactionCompleted(transaction.transactionHash)
  }
    handleChange(event){
      let name = event.target.name
      let coin={}
      coin[name]=event.target.value
      this.setState((p,pr)=>{return {...p,...coin}})
    }
    onSelect(event){
     let name = event.target.name
      let coin={}
      coin[name]=event.target.value
      this.setState((p,pr)=>{return {...p,...coin}})
    }

    async handleSubmit(event){
     //console.log(this.state.coin, this.state.price, this.state.expire, this.state.amount)
     let txid;
       // if(!parseFloat(this.state.price) || !parseInt(this.state.expire) || !this.state.coin){
       //     alert("Please Enter all value  "+ this.state.expire)
       // }
       // else {
        if (parseInt(this.state.step)=== 0) {//makeBet
          // alert(this.state.step)
          // console.log("making bets")
           txid = await this.betInfo.contract.methods.makeBet(this.state.coin,
             toBN(this.state.price),this.state.side==='Higher', toBN(this.state.expire))
             .send({from: this.state.owner, gas: 6000000, value: this.state.amount})
           console.log("txid " ,txid)
           this.props.transactionCompleted(txid.transactionHash)
           this.setState({txid, step: this.state.step + 1})
           //this.getCurrentBet()
         }
         else if (parseInt(this.state.step) === 1) { //take bet
           txid = await this.betInfo.contract.methods.takeBet()
             .send({from: this.state.owner, gas: 6000000, value: 100000})
           console.log("txid " ,txid)
           this.props.transactionCompleted(txid.transactionHash)
           this.setState({txid, step: this.state.step + 1})
           this.getCurrentBet()
         }
         else if (parseInt(this.state.step) === 2) { //settle
           alert(this.state.step)
           this.settle();
           this.getCurrentBet()
         }
       //}
    }

  getCurrentBet = async()=>{
    const accounts = await this.props.web3.eth.getAccounts()
    if(!accounts[0]){
      alert("No account in MetaMask found")
    }
    const id = await await this.props.web3.eth.net.getId()
    const contract  = new this.props.web3.eth.Contract(priceBet['abi'],priceBet['networks'][id].address)
    const address = await contract.options.address
    const data = await contract.methods.getBetInfo().call()
    this.betInfo = {address,contract}
    console.log("this betinfo : ", data)
    const coin = data['2']
    const price = data['3']
    const player1 = data['1']
    const player2=data['7']
    const expire = data['8']
    const amount=data['5']
    const step = !data['0'] ? 0 : !data['6']? 1 : 2
    this.state.owner=  accounts[0]
    this.setState((prev,props)=>{
      return {...prev,coin,player1,player2,price,amount,expire,step}
    })
  }


    render() {
     const BetCard =  (
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
                  >
                    <option>Select...</option>
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  </FormControl>
                </FormGroup>
              </div>
              <div key={1} className="col-md-3">
                <FormGroup>
                  <ControlLabel>Price</ControlLabel>
                  <FormControl
                    type="numbers"
                    bsClass="form-control"
                    name="price"
                    value={this.state.price}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </div>
              <div key={2} className="col-md-4">
                <FormGroup>
                  <ControlLabel>Prediction</ControlLabel>
                  <FormControl
                    type="option"
                    name="side"
                    componentClass="select"
                    bsClass="form-control"
                    value={this.state.side}
                    onChange={this.onSelect}
                  >
                  <option>Higher</option>
                  <option>Lower</option>
                  </FormControl>
                </FormGroup>
              </div>
              </Row>
              <Row>
                <div key={0} className="col-md-6">
                  <FormGroup>
                    <ControlLabel>Bet value (in wei)</ControlLabel>
                    <FormControl
                      type="number"
                      name="amount"
                      bsClass="form-control"
                      placeholder="Bet Value"
                      value={this.state.amount}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>
                <div key={1} className="col-md-6">
                  <FormGroup>
                    <ControlLabel>Duration (in minutes)</ControlLabel>
                    <FormControl
                      type="number"
                      name="expire"
                      bsClass="form-control"
                      placeholder="Duration"
                      value={this.state.expire}
                      onChange={this.handleChange}
                    />
                  </FormGroup>
                </div>
              </Row>
              <Row>
                <div key={0} className="col-md-6">
                  <FormGroup>
                    <ControlLabel>Player1</ControlLabel>
                    <FormControl
                      type="text"
                      bsClass="form-control"
                      placeholder="Player 1"
                      value={this.state.player1}
                      disabled="true"
                    />
                  </FormGroup>
                </div>
                <div key={1} className="col-md-6">
                  <FormGroup>
                    <ControlLabel>Player 2</ControlLabel>
                    <FormControl
                      type="text"
                      bsClass="form-control"
                      placeholder="Player 2"
                      value={this.state.player2}
                      disabled="true"
                    />
                  </FormGroup>
                </div>
              </Row>
              <Button bsStyle="info" pullRight fill type="submit" onClick={this.handleSubmit}>
                {steps[this.state.step]}
              </Button>
            </form>

          }
        />)
      if(this.state.step===undefined) {
        this.getCurrentBet()
        return (<p>Loading Current Bet info...</p>)
      }
      else{
        return BetCard
      }
    }
}



