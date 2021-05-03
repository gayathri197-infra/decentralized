import React, { Component } from "react";
import Aux from "./auxf";
class Logout extends Component {
  state = {};
  componentDidMount() {
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userAddress=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  }
  render() {
    return <Aux> Bye Bye... </Aux>;
  }
}

export default Logout;
