import React, { Component } from "react";
import Aux from "./auxf";
import MainLayout from "./MainLayout";
import PreviewPane from "./preview";
class IssuedCert extends Component {
  state = {
    selected: -1,
    list: [],
    previewData: {
      Recipient: "",
      certFor: "",
      Score: "",
      Dated: "",
      Name: "",
      issuerName: "",
      userAddress: "",
      domain: "",
      certificateID: "",
      qr: ""
    }
  };

  componentDidMount() {}

  getAccountHandler = () => {
    let newstate = { ...this.state };
    newstate.list = [];
    newstate.selected = -1;
    this.setState(newstate, () => {
      window.App.contracts.Document.deployed()
        .then(instance => {
          instance.documentsCount().then(count => {
            for (var i = 1; i <= count; i++) {
              instance.documents(i).then(document => {
                console.log(document);
                for (var j = 1; j < document.length; j++) {
                  if (
                    j == 6 ||
                    j == 2 ||
                    j == 4 ||
                    j == 3 ||
                    j == 8 ||
                    j == 10
                  ) {
                    continue;
                  }

                  document[j] = this.hex2a(
                    document[j].toString().replace("0x", "")
                  );
                }

                if (
                  document[4].toString().replace("0x", "") ==
                  this.props.userData.userAddress.replace("0x", "")
                ) {
                  let newstate = { ...this.state };
                  newstate.list.push(document);
                  this.setState(newstate, () => {
                    console.log(this.state);
                  });
                }
              });
            }
          });
        })
        .catch(err => {
          console.error(err);
        });
    });
  };

  hex2a(hexx) {
    var hex = hexx.toString(); //force conversion
    var str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  render() {
    return (
      <Aux>
        <MainLayout userData={this.props.userData}>
          <div
            className="col-xl-4 col-md-4 col-sm-12 col-xs-12"
            style={{ color: "black" }}
          >
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
              List of issued certificates
            </div>
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                border: "3px solid #6cc091",
                height: "750px"
              }}
            >
              <a
                href="javascript:;"
                className="button special fit"
                onClick={this.getAccountHandler}
              >
                Get List
              </a>

              <table>
                <tbody>
                  {this.state.list.map((element, index) => {
                    return (
                      <tr key={index}>
                        <td
                          style={{
                            cursor: "pointer",
                            background:
                              index == this.state.selected
                                ? "rgba(108, 192, 145, 0.56)"
                                : "white"
                          }}
                          onClick={() => {
                            this.setState({ ...this.state, selected: index });
                          }}
                        >
                          {element[1]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <br />

              <a href="/create" className="button special fit">
                Create a certificate
              </a>
            </div>
          </div>

          <div className="col-xl-8 col-md-8 col-sm-12 col-xs-12">
            {this.state.selected >= 0 ? (
              <PreviewPane
                userData={this.props.userData}
                certData={{
                  Recipient: this.state.list[this.state.selected][3],
                  userAddress: this.state.list[this.state.selected][4],
                  certFor: this.state.list[this.state.selected][5],
                  Score: this.state.list[this.state.selected][6].c[0],
                  Dated: this.state.list[this.state.selected][7],
                  certificateID: this.state.list[this.state.selected][0].c[0],
                  Name: "",
                  issuerName: "",
                  domain: "",
                  isuserVerified: false,
                  qr: ""
                }}
              />
            ) : (
              <PreviewPane
                certData={this.state.previewData}
                userData={this.props.userData}
              />
            )}
          </div>
        </MainLayout>
      </Aux>
    );
  }
}

export default IssuedCert;
