import {ZapSubscriber} from "@zapjs/subscriber";
import Web3 from "web3";
import * as React from "react";
import * as priceBet from "./json/priceBet.json"
import MakeBet from "./makeBet"
import TakeBet from "./takeBet"
import Settle from "./Settle"
import Provider from "./Provider"
interface Props {
    web3: Web3
}
interface Bet{
    contract : any,
    address:string
    data:string[]
}

export default class PriceBet extends React.Component<Props, {}> {
    public betInfo
    public state = {
        betInfo: {} as Bet,
        contractAbi:'',
        error:'',
        owner: '',
        subscriber: ZapSubscriber,
        txid:''
    };

    constructor(props: Props) {
        super(props);
    }
    public getCurrentBet = async()=>{
        const accounts = await this.props.web3.eth.getAccounts()
         const id = await await this.props.web3.eth.net.getId()
        const contract  = new this.props.web3.eth.Contract(priceBet['abi'],priceBet['networks'][id].address)
        const address = await contract.options.address
        const data = await contract.methods.getBetInfo().call()
        this.betInfo = {address,contract,data}
        this.state.owner=  accounts[0]
        this.setState((prev,props)=>{
            return {...prev,owner:accounts[0]}
        })
    }

    public transactionCompleted = (txid)=>{
        this.getCurrentBet()
        this.setState({txid})
        this.forceUpdate()
    }


    public render(){
        const components = [(<Provider web3={this.props.web3}/>)]
        const player = this.state.owner;
        // const address = this.state.account;
        if(!player){
            this.getCurrentBet()
            return(
                <div>
                    Loading Current Bet ...
                </div>
            )
        }
        else{
            const data = this.betInfo.data
            const betContractInfo = (
                <div>
                    <h3>Bet Contract information </h3>
                    <ul>
                        <li>Contract Address : {this.betInfo.address}</li>
                        <li>inplay : {data['0'].toString()} </li>
                        <li>player1 : { data['1']}</li>
                        <li>coin : {data['2']}</li>
                        <li>price : {data['3']}</li>
                        <li>betHigher : {data['4'].toString()}</li>
                        <li>betAmount : {data['5']} wei</li>
                        <li>taken : {data['6'].toString()}</li>
                        <li>player2 : {data['7']}</li>
                        <li>Expire : {data['8']} </li>
                    </ul>
                    <p>{this.betInfo.contract._address}</p>
                </div>
            )
            components.push(betContractInfo)
            if(!data['0']){
                components.push(<MakeBet betInfo = {this.betInfo} account={this.state.owner} transactionCompleted={this.transactionCompleted}/>)
            }
            if(data['0'] && !data['6']){
                components.push(<h3>Take Bet</h3>)
                components.push(<TakeBet betInfo={this.betInfo} account={this.state.owner} transactionCompleted={this.transactionCompleted}/>)
            }
            if(data['8']>0){
                components.push(<h3>Settle</h3>)
                components.push(<Settle web3={this.props.web3} betInfo={this.betInfo} account={this.state.owner} transactionCompleted={this.transactionCompleted}/>)
            }
            if(this.state.txid){
                components.push(<p>Transaction completed : {this.state.txid}</p>)
            }
            return components
        }
    }

}