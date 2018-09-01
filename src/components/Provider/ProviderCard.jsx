import React, { Component } from "react";
import {Card} from "../Card/Card";

export class ProviderCard extends Component {
  render() {
    return (
      <Card
        title="Provider Info"
        content={
          <div className="author">
              <h4 className="title text-center">
                {this.props.name}
                <hr />
                <small className="text-left">Owner</small>
                <p className="text-capitalize"> {this.props.owner}</p>
                <small className="text-left">Pubkey</small>
                <div className="description text-dark">{this.props.pubkey}</div>
              </h4>
          </div>
        }
    />
    );
  }
}

export default ProviderCard;
