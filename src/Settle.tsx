import * as React from "react";
import {ZapSubscriber} from "@zapjs/subscriber"
import {ZapBondage} from "@zapjs/bondage"
import {oracle} from "./config";

interface Props {
    betInfo:any,
    account:string,
    web3:any,
    transactionCompleted:any
}
export default class Settle extends React.Component<Props, {}> {
    public state = {
        txid:''
    }
    constructor(props:Props){
        super(props);
        this.settle = this.settle.bind(this)
    }

    public settle = async()=>{
        // approve, bond, query
        const subscriber = new ZapSubscriber(this.props.account,{networkId: 42,networkProvider: this.props.web3})
        const zapBondage = new ZapBondage({networkId: 42,networkProvider: this.props.web3})
        const zapRequire = await zapBondage.calcZapForDots({
            dots:1,
            endpoint:oracle.endpoint,
            provider:oracle.address
        })
        subscriber.zapToken.approve({amount:zapRequire,from:this.props.account,to:subscriber.zapBondage.contract.options.address})
        await subscriber.zapBondage.delegateBond({
            dots:1,
            endpoint:oracle.endpoint,
            from:this.props.account,
            provider:oracle.address,
            subscriber:this.props.betInfo.contract.options.address,
        })
        const transaction = await this.props.betInfo.contract.methods.queryProvider()
            .send({from:this.props.account,gas:6000000})
        this.props.transactionCompleted(transaction.transactionHash)
    }
    public render(){
        if(!this.state.txid) {
            return (<button onClick={this.settle}>Settle Now</button>)
        }
        else{
           return;
        }
    }
}



