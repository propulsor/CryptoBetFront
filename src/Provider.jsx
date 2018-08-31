import {ZapProvider} from "@zapjs/provider";
import * as React from "react";
import {oracle} from "./config";
import ProviderCard from "./components/Provider/ProviderCard.jsx";



export default class Provider extends React.Component {
    state = {
        accounts:[''],
        curve:[''],
        endpoint:"price",
        init:false,
        provider:ZapProvider,
        pubkey:'',
        title:''
    }

    // private _pollingIntervalId: any;
    constructor(props){
        super(props);
    }
    getProviderAsync = async()=>{
        let init=false;
        let title;
        let curve
        let pubkey
        const accounts = await this.props.web3.eth.getAccounts()
        const providerOwner = oracle.address
        const provider = new ZapProvider(providerOwner,{
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


    render(){
        if(this.state.init){
            const info = this.state
           // const titleString =  `Owner: ${info.accounts[0]} \n Title: ${info.title} \n Endpoint: ${info.endpoint} \n Curve: ${info.curve.values}`
            return (
                <ProviderCard className="card card-user"
                    name={info.title}
                    owner={info.accounts[0]}
                    pubkey={info.pubkey}
                    endpoint={info.endpoint}
                    curve={info.curve.values}
                />
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