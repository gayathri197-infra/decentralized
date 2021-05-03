import React, { Component } from "react";
import Aux from "./auxf";
import Home from "./home";
import CreateCert from "./create";
import { Switch, Route } from "react-router-dom";
import IssuedCert from "./issuedCert";
import Login from "./login";
import Logout from "./logout";
import CreateAccount from "./createAccount";
import ViewMyCertificates from "./viewmyCertificates";
import Swal from "sweetalert2";
import VerifyCertificates from "./verify";

class App extends Component {
  state = {
    loggedin: false,
    userID: "",
    userAddress: "",
    userName: "",
    isIssuer: false,
    issuerName: "",
    domain: "",
    isuserVerified: false
  };

  componentWillMount() {
    let cookie = this.getCookie("userAddress");
    if (cookie != "") {
      console.log(
        this.getCookie("userAddress")
          .toString()
          .replace("0x", "")
      );
      // console.log(window.App.account.replace("0x", ""));
      // if (
      //   this.getCookie("userAddress")
      //     .toString()
      //     .replace("0x", "") != window.App.account.replace("0x", "")
      // ) {
      //   Swal.fire(
      //     "Error!",
      //     "Metamask account doesnt match with logged in account! Kindly logout and login with account signed in with MetaMask",
      //     "error"
      //   );
      // }
      let newstate = { ...this.state };
      newstate.loggedin = true;
      newstate.userID = this.getCookie("userID");
      newstate.userAddress = this.getCookie("userAddress");
      newstate.userName = this.getCookie("userName");
      newstate.isIssuer = this.getCookie("isIssuer") == "true";
      newstate.issuerName = this.getCookie("issuerName");
      newstate.domain = this.getCookie("domain");
      newstate.isuserVerified = this.getCookie("isuserVerified") == "true";
      this.setState(newstate);
    }
  }

  getCookie = cname => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  render() {
    return (
      <Aux>
        <Switch>
          <Route
            path="/create"
            render={() => <CreateCert userData={this.state} />}
          />
          <Route
            path="/issuedCert"
            render={() => <IssuedCert userData={this.state} />}
          />
          <Route
            path="/createAccount"
            render={() => <CreateAccount userData={this.state} />}
          />
          <Route
            path="/viewmycertificates"
            render={() => <ViewMyCertificates userData={this.state} />}
          />
          <Route
            path="/verify"
            render={() => <VerifyCertificates userData={this.state} />}
          />
          <Route path="/login" render={() => <Login userData={this.state} />} />
          <Route path="/logout" render={() => <Logout />} />
          <Route path="/" render={() => <Home userData={this.state} />} />
        </Switch>
      </Aux>
    );
  }
}

export default App;
