import * as React from "react";

interface Props {
    betInfo:any,
    account:string,
    transactionCompleted:any
}
export default class TakeBet extends React.Component<Props, {}> {
    public state = {
        txid:''
    }
    constructor(props:Props){
        super(props);
        this.takeBet = this.takeBet.bind(this)
    }

    public takeBet = async()=>{
        const value = await this.props.betInfo.contract.methods.betAmount().call()
        const transaction = await this.props.betInfo.contract.methods.takeBet()
            .send({from:this.props.account,value,gas:6000000})
        this.props.transactionCompleted(transaction.transactionHash)

    }
    public render(){
        if(!this.state.txid) {
            return (<button onClick={this.takeBet}>TakeBet</button>)
        }
        else{
            return ;
        }
    }
}



