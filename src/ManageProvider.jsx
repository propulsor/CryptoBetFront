import {ZapProvider} from "@zapjs/provider";
import * as React from "react";
import {oracle} from "./config";
import ProviderCard from "./components/Provider/ProviderCard.jsx";
import * as Web3 from "web3"
import {EndpointCard} from "components/Provider/Endpointcard.jsx"
import { Grid, Row, Col } from "react-bootstrap";



export default class ManageProvider extends React.Component {
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

  // public createProviderAsync = async()=>{
  //     const init:boolean=true;
  //     let title:string;
  //     let pubkey:string|number
  //     const accounts = await this.web3.eth.getAccounts()
  //     const providerOwner = accounts[0]
  //     const provider:ZapProvider = new ZapProvider(providerOwner,{
  //         networkId:42,
  //         networkProvider: this.web3
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
      let components = [(
        <Row xs={12}>
          <Col xs={12} md={12}>
          <ProviderCard className="card card-stats"
                      name={info.title}
                      owner={info.providerOwner}
                      pubkey={info.pubkey}
        />
          </Col>
        </Row>
      )]
      let ep =[<p></p>]
      Object.keys(info.endpoints).map(e=>{
        ep.push(
            <Col xs={12} md={6}>
            <EndpointCard className="card card-user"
                        endpoint={e}
                        curve={info.endpoints[e]}
          />
            </Col>
        )
      })
      components.push(<Row>{ep}</Row>)
      return  (
        <div className="wrapper">
        <Grid fluid>
            {components}
        </Grid>
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