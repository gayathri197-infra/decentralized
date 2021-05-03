import React, { Component } from "react";
import Aux from "./auxf";
import MainLayout from "./MainLayout";
import swal from "sweetalert";
class Login extends Component {
  state = {
    Address: "",
    Password: ""
  };

  componentWillMount() {}

  loginHandler = () => {
    window.App.contracts.Document.deployed().then(instance => {
      instance.usersCount().then(result => {
        var count = result.c[0];
        let flag = 0;
        if (count == 0) {
          swal("Login", "Invalid login credentials!", "error");
        }

        instance.users(this.state.Address).then(user => {
          console.log(user);
          if (user[0].c[0] == 0) {
            swal("Login", "Invalid login credentials!", "error");
            return;
          } else {
            var v = user[1].toString().replace("0x", "");

            var w = this.hex2a(user[3].toString().replace("0x", ""));
            console.log(w);
            if (
              v == this.state.Address.replace("0x", "").toLowerCase() &&
              w == this.state.Password
            ) {
              var z = user[2].toString().replace("0x", "");

              flag = 1;
              this.setCookie("userID", user[0], 1);
              this.setCookie("userAddress", v, 1);
              this.setCookie("userName", this.hex2a(z), 1);
              this.setCookie("isIssuer", user[4], 1);
              this.setCookie(
                "issuerName",
                this.hex2a(user[5].toString().replace("0x", "")),
                1
              );
              this.setCookie(
                "domain",
                this.hex2a(user[6].toString().replace("0x", "")),
                1
              );
              this.setCookie("isuserVerified", user[7].toString, 1);
              window.location.href = "/";
              return;
            } else {
              swal("Login", "Invalid login credentials!", "error");
            }
          }
        });
      });
    });
  };

  setCookie = (cname, cvalue, exdays) => {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      if (this.state.Address != "" && this.state.Password) {
        this.loginHandler();
      }
    }
  };

  hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  render() {
    if (this.props.userData.loggedin == true) {
      window.location.href = "/";
      return false;
    } else {
      return (
        <Aux>
          <MainLayout userData={this.props.userData}>
            <div className="inner" style={{ margin: "0px", width: "100%" }}>
              <header className="align-center">
                <div className="row">
                  <div className="col-md-4" />
                  <div className="col-md-4">
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
                      Login
                    </div>
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        border: "3px solid #6cc091"
                      }}
                    >
                      <div className="text-input">
                        <input
                          type="text"
                          id="Address"
                          autoComplete="off"
                          ref={input => {
                            this.Address = input;
                          }}
                          defaultValue={window.App.account}
                          onChange={e => {
                            this.setState({ [e.target.id]: e.target.value });
                          }}
                        />
                        <label htmlFor="Address">Address</label>
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
                      <br />
                      <br />
                      <button
                        className={
                          "button special fit " +
                          (this.state.Address != "" && this.state.Password != ""
                            ? ""
                            : "disabled")
                        }
                        onClick={this.loginHandler}
                      >
                        Login
                      </button>
                      <br />
                    </div>
                  </div>
                </div>
                <div className="col-md-4" />
              </header>
              <br />
            </div>
          </MainLayout>
        </Aux>
      );
    }
  }
}

export default Login;
