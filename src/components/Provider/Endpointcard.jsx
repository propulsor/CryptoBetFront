import React, { Component } from "react";
import {Card} from "../Card/Card";

export class EndpointCard extends Component {
  render() {
    const Curve = this.props.curve.join(" | ")
    return (
      <Card
        title="Endpoint"
        content={
          <div className="author">
            <h4 className="title text-center">
              {this.props.endpoint}
              <hr />
              <small className="text-left">Curve</small>
              <p className="description ">{Curve}</p>
            </h4>
          </div>
        }
      />
    );
  }
}

export default EndpointCard;
