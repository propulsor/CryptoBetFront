import * as React from "react";
import  {toBN} from 'web3-utils'

interface Props {
    betInfo:any,
    account:string,
    transactionCompleted:any
}
export default class MakeBet extends React.Component<Props, {}> {
   public state = {
       coin:'',
       price:0,
       side:'higher',
       time:0, // minutes
       txid:''
   }
    constructor(props:Props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public handleChange(event){
       this.setState({[event.target.name]:event.target.value})
    }

    public handleSubmit(event){
       if(!this.state.price || !this.state.time || !this.state.coin){
           alert("Please Enter all value")
       }
       const higher = this.state.side ==="higher"
        const createBet = this.props.betInfo.contract.methods.makeBet(this.state.coin,
       toBN(this.state.price),higher,toBN(this.state.time))
       .send({from:this.props.account,gas:6000000,value:100000})
        this.setState({txid:createBet})

    }

    public render(){
        const coms= [(
            <form onSubmit={this.handleSubmit}>
                <span>Coin : </span>
                <input type='text' name="coin" value={this.state.coin} onChange={this.handleChange}/>
                <br/><span>Price : </span>
                <input type='number' name="price" value={this.state.price} onChange={this.handleChange}/>
                <br/><select name="side" value={this.state.side} onChange={this.handleChange}>
                    <option value="higher">Higher</option>
                    <option value="lower">Lower</option>
                </select>
                <br/>Duration (in minutes from the bet):
                <input type='number' name="time" value={this.state.time} onChange={this.handleChange}/>
                <br/><button onClick={this.handleSubmit}>Submit</button>
            </form>
        )]
        if(this.state.txid){
            this.props.transactionCompleted(this.state.txid)
            coms.push(<p>Result : {this.state.txid}</p>)
        }
        return coms
    }
}



