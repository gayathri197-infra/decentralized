import React, { Component } from "react";
import Aux from "./auxf";
import swal from "sweetalert2";

class Home extends Component {
  state = { allusers: [] };

  render() {
    console.log(this.state);
    return (
      <Aux>
        <div>
          <header id="header">
            <div className="inner">
              <a href="index.html" className="logo">
                <strong>Decentralized cloud storage</strong> using BlockChain
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

          <section id="banner" style={{ padding: "5.5em 0 9em 0", zIndex: 0 }}>
            <div className="inner" style={{ padding: "4em" }}>
              <header>
                <h1>Decentralized blockchain storage in cloud</h1>
               
              </header>
              <div className="row" style={{ padding: "40px" }}>
                <div className="col-xl-6 col-md-4 col-sm-4 col-xs-12">
                  <span className="icon fa-plus" />
                  <h3>New document</h3>
                  <p style={{ padding: "20px" }}>
                    Add a file to cloud and log the metadata in blockchain
                  </p>
                  <a href="create" className="button">
                      Upload now
                    </a>
                </div>
                <div className="col-xl-6 col-md-4 col-sm-4 col-xs-12">
                  <span className="icon fa-user" />
                  <h3>View</h3>
                  <p style={{ padding: "20px" }}>
                    View and download documents in cloud using blockchain
                  </p>
                  <a href="viewmycertificates" className="button">
                      View Files
                    </a>
                </div>
               
              </div>
              <footer>
                <a href="/createAccount" className="button">
                  Create account
                </a>
              </footer>
            </div>
          </section>

        
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

export default Home;
