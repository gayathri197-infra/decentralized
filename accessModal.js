import React, { Component } from "react";
import Aux from "./auxf";
import Swal from "sweetalert2";

class AccessModal extends Component {
  state = { listofAccess: [] };
  componentDidMount() {
    // Get the modal
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    window.onclick = event => {
      if (event.target == modal) {
        modal.style.display = "none";
        this.props.closeHandler();
      }
    };

    this.getAccessList();
  }

  getAccessList = () => {
    window.App.contracts.Document.deployed().then(async instance => {
      console.log(instance);
      for (let i = 1; i <= this.props.accessCount; i++) {
        await instance
          .listofAccess(this.props.documentID, i)
          .then(userAddress => {
            instance
              .users(userAddress)
              .then(user => {
                let newstate = { ...this.state };
                newstate.listofAccess.push([
                  userAddress,
                  this.hex2a(user[2].toString().replace("0x", ""))
                ]);
                this.setState(newstate);
              })
              .catch(err => {
                let newstate = { ...this.state };
                newstate.listofAccess.push([userAddress, "error"]);
                this.setState(newstate);
              });
          });
      }
    });
  };

  hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  addAccessHandler = () => {
    if (this.AddressTextRef.value != "" && this.props.documentID != "") {
      window.App.contracts.Document.deployed().then(instance => {
        instance
          .addAccess(this.props.documentID, this.AddressTextRef.value)
          .then(result => {
            console.log(result);
          });
      });
    } else {
      Swal.fire("Error!", "Enter valid address", "error");
    }
  };

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      if (e.target.value != "") {
        this.addAccessHandler();
      }
    }
  };

  render() {
    return (
      <Aux>
        <div id="myModal" className="modal" style={{ zIndex: "999" }}>
          <div
            className="modal-content"
            style={{ width: "35%", minWidth: "500px" }}
          >
            <div className="modal-body" style={{ zoom: 1 }}>
              <input
                type="text"
                id="Address"
                autoComplete="off"
                onKeyPress={this._handleKeyPress}
                ref={input => {
                  this.AddressTextRef = input;
                }}
                style={{
                  background: "white",
                  color: "black",
                  display: "inline-block",
                  borderBottomRightRadius: "30px",
                  borderTopRightRadius: "30px"
                }}
              />
              <a
                href="javascript:;"
                onClick={this.addAccessHandler}
                className="button special"
                style={{
                  display: "inline",
                  position: "absolute",
                  right: "18px",
                  marginTop: "1.25px",
                  height: "3.55em",
                  textDecoration: "none"
                }}
              >
                >
              </a>
              <br />
              <br />
              <h5>
                <center>List of addresses given access</center>
              </h5>
              <table>
                <tbody
                  style={{
                    maxHeight: "350px",
                    overflow: "auto",
                    display: "block"
                  }}
                >
                  {this.state.listofAccess.map((element, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            background: "white",
                            textAlign: "center",
                            verticalAlign: "middle"
                          }}
                        >
                          {element[0]}
                          <br />[{element[1]}]
                        </td>
                        <td
                          style={{
                            cursor: "pointer",
                            background: "white",
                            textAlign: "center",
                            verticalAlign: "middle"
                          }}
                        >
                          <i className="fa fa-trash" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default AccessModal;
