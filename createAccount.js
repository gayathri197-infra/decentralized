import React, { Component } from "react";
import Aux from "./auxf";
import MainLayout from "./MainLayout";
import swal from "sweetalert";

class CreateAccount extends Component {
  state = {
    Address: "",
    Name: "",
    Password: "",
    isIssuer: false,
    issuerName: "",
    domain: ""
  };

  createAccountHandler = () => {
    window.App.contracts.Document.deployed()
      .then(instance => {
        console.log(instance);
        var currentDate = new Date().getTime();

        return instance.addUser(
          this.state.Name,
          this.state.Address,
          this.state.Password,
          this.state.isIssuer,
          this.state.issuerName,
          this.state.domain,
          { from: window.App.account }
        );
      })
      .then(function(result) {
        swal("User added", "User added successfully!", "success").then(
          value => {
            document.location.reload();
          }
        );
      })
      .catch(function(err) {
        console.error(err);
      });
  };
  render() {
    console.log(window.App)
    return (
      <Aux>
        <MainLayout userData={this.props.userData}>
          <div className="inner" style={{ margin: "0px", width: "100%" }}>
            <header className="align-center">
              <div className="row">
                <div className="col-md-2" />
                <div className="col-md-8">
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      border: "3px solid #6cc091",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      background: "#6cc091",
                      color: "white"
                    }}
                  >
                    Create Account
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      border: "3px solid #6cc091"
                    }}
                  >
                    <div className="row">
                      <div className="col-md-6">
                        <div className="text-input">
                          <input
                            type="text"
                            id="Address"
                            autoComplete="off"
                            ref={input => {
                              this.Address = input;
                            }}
                            onChange={e => {
                              this.setState({ [e.target.id]: e.target.value });
                            }}
                          />
                          <label htmlFor="Address">Address</label>
                        </div>

                        <div className="text-input">
                          <input
                            type="text"
                            id="Name"
                            autoComplete="off"
                            ref={input => {
                              this.Name = input;
                            }}
                            onChange={e => {
                              this.setState({ [e.target.id]: e.target.value });
                            }}
                          />
                          <label htmlFor="Name">Username</label>
                        </div>
                        <div className="text-input">
                          <input
                            type="password"
                            id="Password"
                            autoComplete="off"
                            ref={input => {
                              this.Password = input;
                            }}
                            onKeyPress={this._handleKeyPress}
                            onChange={e => {
                              this.setState({ [e.target.id]: e.target.value });
                            }}
                          />
                          <label htmlFor="Password">Password</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="text-input">
                          <div
                            className="12u$ 12u$(small)"
                            style={{ padding: "4px" }}
                          >
                            <input
                              type="checkbox"
                              id="demo-human"
                              name="demo-human"
                              onChange={e => {
                                this.setState({ isIssuer: e.target.checked });
                              }}
                            />
                            <label htmlFor="demo-human">Uploader?</label>
                          </div>
                        </div>
                        {this.state.isIssuer ? (
                          <Aux>
                            <div className="text-input">
                              <input
                                type="text"
                                id="issuerName"
                                autoComplete="off"
                                ref={input => {
                                  this.issuerName = input;
                                }}
                                defaultValue={this.state.issuerName}
                                onChange={e => {
                                  this.setState({
                                    [e.target.id]: e.target.value
                                  });
                                }}
                              />
                              <label htmlFor="issuerName">Name</label>
                            </div>

                            <div className="text-input">
                              <input
                                type="text"
                                id="domain"
                                autoComplete="off"
                                ref={input => {
                                  this.domain = input;
                                }}
                                defaultValue={this.state.domain}
                                onChange={e => {
                                  this.setState({
                                    [e.target.id]: e.target.value
                                  });
                                }}
                              />
                              <label htmlFor="domain">Comments</label>
                            </div>
                          </Aux>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <br />
                    <br />
                    <button
                      className={
                        "button special fit " +
                        (this.state.Address != "" &&
                        this.state.Name != "" &&
                        this.state.Password != "" &&
                        (this.state.isIssuer
                          ? this.state.issuerName != "" &&
                            this.state.domain != ""
                          : true)
                          ? ""
                          : "disabled")
                      }
                      onClick={this.createAccountHandler}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-2" />
            </header>
          </div>
        </MainLayout>
      </Aux>
    );
  }
}

export default CreateAccount;
