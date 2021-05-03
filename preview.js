import React, { Component } from "react";
import Aux from "./auxf";
import swal from "sweetalert";
import qrcode from "qrcode-generator";
class PreviewPane extends Component {
  state = {
    DocumentName: "",
    certificateID: "",
    Recipient: "",
    certFor: "",
    Score: "",
    Dated: "",
    Name: "",
    issuerName: "",
    userAddress: "",
    domain: "",
    qr: ""
  };

  componentWillReceiveProps(newProps) {
    this.getIssuerDataAndSetState(newProps.certData);
  }

  componentDidMount() {
    this.getIssuerDataAndSetState(this.props.certData);
  }

  getIssuerDataAndSetState(certData) {
    var typeNumber = 4;
    // var errorCorrectionLevel = "L";
    // var qr = qrcode(typeNumber, errorCorrectionLevel);
    // qr.addData(certData.certificateID);
    // qr.make();
    // certData.qr = qr.createImgTag();

    if (certData.issuerName == "" && certData.userAddress != "") {
      window.App.contracts.Document.deployed().then(instance => {
        instance
          .users(certData.userAddress)
          .then(user => {
            console.log(user);
            certData.issuerName = this.hex2a(
              user[5].toString().replace("0x", "")
            );
            certData.domain = this.hex2a(user[6].toString().replace("0x", ""));
            certData.isuserVerified = user[7];
            instance
              .users(certData.Recipient)
              .then(user => {
                console.log(user);
                certData.Name = this.hex2a(
                  user[2].toString().replace("0x", "")
                );
                this.setState(certData);
              })
              .catch(err => {
                this.setState(certData);
              });
          })
          .catch(err => {
            this.setState(certData);
          });
      });
    } else {
      this.setState(certData);
    }
  }

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
        <div
          style={{
            color: "white",
            padding: "10px",
            textAlign: "center",
            border: "3px solid #6cc091",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            background: "#6cc091"
          }}
        >
          File details
        </div>
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            border: "3px solid #6cc091",
            height: "750px"
          }}
        >
          <div
            style={{
              width: "100%",
              padding: "20px",
              textAlign: "center",
              border: "0px solid #787878"
            }}
          >
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                border: "0px solid #787878"
              }}
            >
              <span style={{ fontSize: "50px", fontWeight: "bold" }}>
                File upload
              </span>
              <span style={{ fontSize: "25px" }}>
                <i>  {this.state.DocumentName} </i>
              </span>

              <span style={{ fontSize: "25px" }}>
                <i>Upload to: {this.state.Name} </i>
              </span>
          
              <span style={{ fontSize: "15px" }}>
                (0x{this.state.Recipient.toString().replace("0x", "")})
              </span>
              <br />
              <br />
              <div className="row">
                <div className="col-md-12">
                  <img src="images/open-file-icon.png" />
                  </div>
                  </div>
                  <i>
                      File size:  <b>{(this.state.Score / 1024/1024).toFixed(3)  + "MB" }</b>
                    </i>
              <div className="row">
                <div className="col-md-12">
                  <span style={{ fontSize: "20px" }}>
                    <i>
                      Uploaded by <b>{this.state.issuerName}</b>
                    </i>
                  </span>
                  (
                  <span style={{ fontSize: "15px" }}>
                    0x{this.state.userAddress.toString().replace("0x", "")}
                  </span>
                  )
                  <br />
                  {this.state.certificateID != "" ? (
                    <span style={{ fontSize: "20px" }}>
                      <i>
                        Upload ID: <b>{this.state.certificateID}</b>
                      </i>
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-md-6">
                  {this.state.qr != "" ? (
                    <Aux>
                      <div
                        dangerouslySetInnerHTML={{ __html: this.state.qr }}
                      />
                      <br />
                      Digitally signed by blockchain
                    </Aux>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default PreviewPane;
