import React, { Component } from "react";
import Aux from "./auxf";

class MainLayout extends Component {
  state = {};
  render() {
    return (
      <Aux>
        <div className="subpage">
          <header id="header">
            <div className="inner">
              <a href="index.html" className="logo">
                <strong>Decentralized Cloud Storage</strong> using BlockChain
              </a>
              <nav id="nav">
                <a href="index.html">Home</a>
                {this.props.userData.loggedin == false ? (
                  <a href="/login">Login</a>
                ) : (
                  <Aux>
                    <div className="dropdown">
                      <div className="dropbtn">
                        Welcome {this.props.userData.userName}
                      </div>
                      <div className="dropdown-content">
                        <i>
                          <b>Your Address: </b>
                          {"0x" + this.props.userData.userAddress}
                        </i>
                        <a href="/logout">
                          <b>Logout</b>
                        </a>
                      </div>
                    </div>
                  </Aux>
                )}
              </nav>
              <a href="#navPanel" className="navPanelToggle">
                <span className="fa fa-bars" />
              </a>
            </div>
          </header>
          <div className="row" style={{ margin: "30px" }}>
            {this.props.children}
          </div>

          <footer id="footer" style={{ padding: "20px" }}>
            <div className="copyright" style={{ margin: "0px" }}>
             Student name
             
              <br />
              College
            </div>
          </footer>
        </div>
      </Aux>
    );
  }
}

export default MainLayout;
