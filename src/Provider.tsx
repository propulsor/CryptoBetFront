import {ZapProvider} from "@zapjs/provider";
import Web3 from "web3";
import * as React from "react";
import {oracle} from "./config";

interface Props {
    web3: Web3
}


export default class Provider extends React.Component<Props, {}> {
    public state = {
        accounts:[''],
        curve:[''],
        endpoint:"price",
        init:false,
        provider:ZapProvider,
        pubkey:'',
        title:''
    }
    public accounts:string[]
    // private _pollingIntervalId: any;
    constructor(props: Props) {
        super(props);
    }
    public getProviderAsync = async()=>{
        let init:boolean=false;
        let title:string;
        let curve :any
        let pubkey:string|number
        const accounts = await this.props.web3.eth.getAccounts()
        const providerOwner = oracle.address
        const provider:ZapProvider = new ZapProvider(providerOwner,{
            networkId:42,
            networkProvider: this.props.web3
        })
        init = await provider.isProviderInitialized()
        if(init){
            title = await provider.getTitle()
            pubkey = await provider.getPubkey()
            curve = await provider.getCurve(this.state.endpoint)
            init=true
            return this.setState((prev,props)=>{
                return {...prev,accounts,curve,init,provider,pubkey, title}
            })
        }
        else{
            return this.setState((prev,props)=>{
                return {...prev,accounts,init,provider}
            })
        }
    }

    // public createProviderAsync = async()=>{
    //     const init:boolean=true;
    //     let title:string;
    //     let pubkey:string|number
    //     const accounts = await this.props.web3.eth.getAccounts()
    //     const providerOwner = accounts[0]
    //     const provider:ZapProvider = new ZapProvider(providerOwner,{
    //         networkId:42,
    //         networkProvider: this.props.web3
    //     })
    //     await provider.initiateProvider({public_key:"789",title:"Crypotips"})
    //     await provider.initiateProviderCurve({endpoint:"btcprice",term:[3,1,0,1,100000000000000]})
    //     title = await provider.getTitle()
    //     pubkey = await provider.getPubkey()
    //     return this.setState((prev,props)=>{
    //         return {...prev,accounts,init,provider,pubkey,title}
    //     })
    // }


    public render(){
        if(this.state.init){
            const info = this.state
           // const titleString =  `Owner: ${info.accounts[0]} \n Title: ${info.title} \n Endpoint: ${info.endpoint} \n Curve: ${info.curve.values}`
            return (
                <div>
                    <p><strong>CryptoTips provider: </strong></p>
                    <p>Owner : {info.accounts[0]}</p>
                    <p>Title : {info.title}</p>
                    <p>Endpoint : {info.endpoint}</p>
                    <p>Curve : {info.curve.values[0]} | {info.curve.values[1]} | {info.curve.values[2]}</p>
                </div>
            )
        }
        else {
        this.getProviderAsync()
            return (
                <div>
                    {/*<button onClick={this.getProviderAsync}>Get CryptoTips Provider</button>*/}
                    <p> Fetching CryptoTips Oracle ... </p>
                </div>
            )
        }
    }

}