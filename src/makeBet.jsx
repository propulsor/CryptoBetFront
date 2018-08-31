import * as React from "react";
import  {toBN} from 'web3-utils'
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import { FormGroup, ControlLabel, FormControl, Row } from "react-bootstrap";
import * as priceBet from "./json/priceBet";
import * as Web3 from "web3"
const steps = ['Make Bet', 'Take Bet', 'Settle']


// interface Props {
//     betInfo:any,
//     account:string,
//     transactionCompleted:any
// }
export default class MakeBet extends React.Component{
   state = {
       coin:'',
       price:0,
       side:'higher',
       expire:0, // minutes
       txid:'',
     player1: '',
     player2: '',
     amount: 0
   }
   betInfo = {}
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSelect = this.onSelect.bind(this);
    }

    handleChange(event){
      let name = event.target.name
      let coin={}
      coin[name]=event.target.value
      this.setState(coin)
    }
    onSelect(event){
     let name = event.target.name
      let coin={}
      coin[name]=event.target.value
     this.setState(coin)
    }

    handleSubmit(event){
     console.log(this.state.coin, this.state.price, this.state.expire, this.state.amount)
     let txid;
     console.log(this.state.coin, !(parseFloat(this.state.price)),!(parseInt(this.state.expire)))
       if(!parseFloat(this.state.price) || !parseInt(this.state.expire) || !this.state.coin){
           alert("Please Enter all value  "+ this.state.expire)
       }
       else {
         const higher = this.state.side === "higher"
         if (this.state.step = 0) {//makeBet
           txid = this.betInfo.contract.methods.makeBet(this.state.coin,
             toBN(this.state.price), higher, toBN(this.state.expire))
             .send({from: this.props.account, gas: 6000000, value: this.state.amount})
           console.log(txid)
           this.props.transactionCompleted(txid)
           //this.setState({txid, step: this.state.step + 1})
         }
         else if (this.state.step = 1) { //take bet
           txid = this.props.betInfo.contract.methods.takeBet()
             .send({from: this.props.account, gas: 6000000, value: 100000})
         }
         else if (this.state.step = 2) { //settle
           this.settle();
         }
       }
    }

  getCurrentBet = async()=>{
    const accounts = await this.props.web3.eth.getAccounts()
    const id = await await this.props.web3.eth.net.getId()
    const contract  = new this.props.web3.eth.Contract(priceBet['abi'],priceBet['networks'][id].address)
    const address = await contract.options.address
    const data = await contract.methods.getBetInfo().call()
    this.betInfo = {address,contract}
    console.log("this betinfo : ", this.betInfo)
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
                  name='coin'
                  onChange={this.onSelect}
                  >
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
     if(!this.state.player1) {
       this.getCurrentBet()
     }
     return BetCard
    }
}



