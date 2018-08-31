import * as React from "react";
import  {toBN} from 'web3-utils'
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import { Card } from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import * as priceBet from "./json/priceBet";
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
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event){
     console.log(event.target.name, event.target.value)
       this.setState({price:event.target.value})
    }

    handleSubmit(event){
     let txid;
       if(!this.state.price || !this.state.expire || !this.state.coin){
           alert("Please Enter all value , "+ this.state.price)
         return
       }
       const higher = this.state.side ==="higher"
      if(this.state.step=0) {//makeBet
         txid = this.props.betInfo.contract.methods.makeBet(this.state.coin,
          toBN(this.state.price), higher, toBN(this.state.time))
          .send({from: this.props.account, gas: 6000000, value: 100000})
      }
      else if(this.state.step=1){ //take bet
        txid = this.props.betInfo.contract.methods.takeBet()
          .send({from: this.props.account, gas: 6000000, value: 100000})
      }
      else if(this.state.step=2){ //settle
        this.settle();
      }
        this.setState({txid,step:this.state.step+1})
    }

  getCurrentBet = async()=>{
    const accounts = await this.props.web3.eth.getAccounts()
    const id = await await this.props.web3.eth.net.getId()
    const contract  = new this.props.web3.eth.Contract(priceBet['abi'],priceBet['networks'][id].address)
    const address = await contract.options.address
    const data = await contract.methods.getBetInfo().call()
    this.betInfo = {address,contract}
    console.log(data)
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
              <FormInputs
                ncols={["col-md-5", "col-md-3", "col-md-4"]}
                proprieties={[
                  {
                    label: "Coin",
                    type: "option",
                    componentClass: "select",
                    bsClass: "form-control",
                    placeholder: "Coin",
                    defaultValue: this.state.coin,
                    options: ["BTC", "ETH"]
                  },
                  {
                    label: "Price",
                    type: "number",
                    bsClass: "form-control",
                    placeholder: "Price",
                    name:'price',
                    defaultValue: this.state.price
                  },
                  {
                    label: "Prediction",
                    type: "select",
                    bsClass: "form-control",
                    placeholder: this.state.side
                  }
                ]}
                />

              <FormInputs
                ncols={["col-md-6", "col-md-6"]}
                proprieties={[
                  {
                    label: "Bet value (in wei)",
                    type: "number",
                    bsClass: "form-control",
                    placeholder: "Bet Value",
                    defaultValue: this.state.amount
                  },
                  {
                    label: "Duration (in minutes)",
                    type: "number",
                    bsClass: "form-control",
                    placeholder: "Duration",
                    defaultValue: this.state.expire
                  }
                ]}
              />
              <FormInputs
                ncols={["col-md-6", "col-md-6"]}
                proprieties={[
                  {
                    label: "Player 1",
                    type: "text",
                    bsClass: "form-control",
                    value: this.state.player1,
                    disabled:true
                  },
                  {
                    label: "Player2",
                    type: "text",
                    bsClass: "form-control",
                    value: this.state.player2,
                    disabled:true
                  }
                ]}
              />
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



