import React, { Component } from "react";
import Aux from "./auxf";
import MainLayout from "./MainLayout";
import PreviewPane from "./preview";
import md5 from "md5";
import swal from "sweetalert";

class CreateCert extends Component {
  state = {
    qr: "",
    DocumentName: "",
    Recipient: "",
    certFor: "",
    Score: 0,
    Dated: [],
    Name: "",
    isIssuer: this.props.userData.isIssuer,
    issuerName: this.props.userData.issuerName,
    userAddress: this.props.userData.userAddress,
    domain: this.props.userData.domain,
    isuserVerified: this.props.userData.isuserVerified,
    file : undefined,
    successCounter: 0
  };

  componentWillMount() {
    console.log(this.state.isIssuer);
    if (!this.state.isIssuer) {
      swal("Invalid access", "You are not registered as issuer!", "error").then(
        value => {
          document.location.href = "/";
          return false;
        }
      );
      return false;
    }
  }

  componentDidMount() {
    window.$("#Dated").datepicker({
      dateFormat: "dd-M-yy",
      onSelect: () => {
        this.setState({ Dated: window.$("#Dated").val() });
      }
    });
  }

  getNameHandler = str => {
    this.nameRef.value = "";
    window.App.contracts.Document.deployed().then(instance => {
      instance
        .users(str)
        .then(user => {
          var w = user[2].toString().replace("0x", "");
          this.nameRef.value = this.hex2a(w);
          this.setState({ Name: this.nameRef.value, Recipient: str });
        })
        .catch(err => {
          this.setState(this.setState({ Name: "", Recipient: str }));
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

  createDocument = () => {
    window.App.contracts.Document.deployed()
      .then(instance => {
        console.log(instance);
        var currentDate = new Date().getTime();
        console.log(instance  )
        return instance.addDocument(
          this.state.DocumentName,
          currentDate,
          "0x" + this.state.Recipient.toString(),
          window.App.account.toString(),
          this.state.file.name,
          this.state.Score,
          this.state.Dated.toString(),
          md5(
            [
              this.state.DocumentName,
              currentDate,
              "0x" + this.state.Recipient.toString(),
              window.App.account,
              this.state.file.name,
              this.state.Score,
              this.state.Dated
            ].toString()
          ),
          { from: window.App.account }
        );
      })
      .then(function(result) {
        window.location.reload();
      })
      .catch(function(err) {
        console.error(err);
      });
  };

  uploadDataToCloud = () => {
                      
    var reader = new FileReader();

    reader.onload = async (e) => {
        var fileOrginal = e.target.result;
        var n=10
        const chunkSize = Math.ceil(this.state.file.size / n);
        var i = 0;
        for (let start = 0; start < this.state.file.size; start += chunkSize) {
          const chunk = fileOrginal.slice(start, start + chunkSize );
          const fd = new FormData();
          fd.append('chunk', i);
          fd.append('target_dir', this.state.DocumentName);
          fd.append('target_file', chunk);
          
          await fetch("http://blockchain-cloud.atwebpages.com/upload.php", {method: 'post', body: fd}).then(res => { return res.text() }).then(data => {
          var op = JSON.parse(data)
          if(op["state"] == "success"){
            var newDated = this.state.Dated.concat(op["chunk"]);

            this.setState({successCounter: this.state.successCounter + 1, Dated: newDated }, ()=>{
              if(this.state.successCounter == n){
              
                this.setState({successCounter: -1 })
              }
            })
          }});
          
          i++;
        }
    }

    reader.readAsBinaryString(this.state.file);   

  }

  render() {
    return (
      <Aux>
        <MainLayout userData={this.props.userData}>
          <div
            className="col-xl-4 col-md-4 col-sm-12 col-xs-12"
            style={{ color: "white" }}
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
              Create Upload
            </div>
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                border: "3px solid #6cc091",
                height: "750px"
              }}
            >
              <div className="text-input">
                <input
                  type="text"
                  id="DocumentName"
                  autoComplete="off"
                  onChange={e => {
                    this.setState({ [e.target.id]: e.target.value });
                  }}
                />
                <label htmlFor="input1">DocName</label>
              </div>

              <div className="text-input">
                <input
                  type="text"
                  id="Recipient"
                  autoComplete="off"
                  onChange={e => {
                    this.getNameHandler(e.target.value);
                  }}
                />
                <label htmlFor="input1">Recipient</label>
              </div>

              <div className="text-input">
                <input
                  type="text"
                  id="Name"
                  autoComplete="off"
                  ref={input => {
                    this.nameRef = input;
                  }}
                  onChange={e => {
                    this.setState({ [e.target.id]: e.target.value });
                  }}
                  disabled={true}
                />
                <label htmlFor="input1">Name</label>
              </div>

              <div className="text-input">
                <input
                  type="password"
                  id="certFor"
                  autoComplete="off"
                  onChange={e => {
                    this.setState({ [e.target.id]: e.target.value });
                  }}
                />
                <label htmlFor="input1">Password</label>
              </div>

              <div className="text-input">
                <input
                  type="file"
                  id="File"
                  autoComplete="off"
                  onChange={f => {

                    var file = f.target.files[0];
                    this.setState({ "Score": file.size, "file": file });
                    
                  }}
                />
                <label htmlFor="input1"></label>
              </div>

              <div className="text-input" style={{marginTop: "0px", color:"black"}}>
              {this.state.successCounter}
              {this.state.Dated.toString()}
              </div>
              <br />
              <br />
              <button
                className={
                  "button special fit " +
                  (this.state.Recipient != "" &&
                  this.state.Name != "" &&
                  this.state.DocumentName != "" &&
                  this.state.certFor != "" &&
                  this.state.Score != 0
                    ? ""
                    : "disabled")
                }
                onClick={this.uploadDataToCloud}
              >
                Upload to Cloud
              </button>

              <button
                className={
                  "button special fit " +
                  (this.state.Recipient != "" &&
                  this.state.Name != "" &&
                  this.state.DocumentName != "" &&
                  this.state.certFor != "" &&
                  this.state.Score != 0 && 
                  this.state.Dated != ""
                    ? ""
                    : "disabled")
                }
                onClick={this.createDocument}
              >
                Add to BlockChain
              </button>
              <a href="/issuedCert" className="button special fit">
                View issued certificates
              </a>
            </div>
          </div>

          <div className="col-xl-8 col-md-8 col-sm-12 col-xs-12">
            <PreviewPane certData={this.state} userData={this.props.userData} />
          </div>
        </MainLayout>
      </Aux>
    );
  }
}

export default CreateCert;
