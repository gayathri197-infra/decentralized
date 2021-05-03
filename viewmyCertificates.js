import React, { Component } from "react";
import MainLayout from "./MainLayout";
import Aux from "./auxf";
import PreviewModal from "./previewModal";
import swal from "sweetalert2";
import AccessModal from "./accessModal";
class ViewMyCertificates extends Component {
  state = {
    accessModal: false,
    previewModal: false,
    selected: -1,
    list: [],
    previewData: {
      certificateID: "",
      Recipient: "",
      certFor: "",
      Score: "",
      Dated: "",
      Name: "",
      issuerName: "",
      userAddress: "",
      domain: ""
    }
  };

  componentDidMount() {}

  acceptHandler = index => {
    swal.fire({
      title: "Re-enter your password",
      html: "<br/><input id='password' type='password'/>",
      preConfirm: () => {
        return window.App.contracts.Document.deployed().then(instance => {
          return instance
            .acceptDocument(
              index + 1,
              window.App.account,
              window.$("#password").val(),
              {
                from: window.App.account
              }
            )
            .then(result => {
              instance.getisAccepted
                .call(index + 1, {
                  from: window.App.account
                })
                .then(result2 => {
                  console.log(result2);
                  if (result2) {
                    swal.fire("Success!", "Certificate claimed!", "success");
                  } else {
                    swal.fire(
                      "Error!",
                      "Error occured. Check the password entered!",
                      "error"
                    );
                  }
                });
            })
            .catch(err => {
              console.log(err);
            });
        });
      },
      onOpen: function() {
        window.$("#password").focus();
      }
    });
  };

  getAccountHandler = () => {
    let newstate = { ...this.state };
    newstate.list = [];
    newstate.selected = -1;
    this.setState(newstate, () => {
      window.App.contracts.Document.deployed()
        .then(instance => {
          instance.documentsCount().then(async count => {
            this.totalCount = count;
            for (var i = 1; i <= count; i++) {
              await instance.documents(i).then(document => {
                for (var j = 1; j < document.length; j++) {
                  if (
                    j == 6 ||
                    j == 2 ||
                    j == 4 ||
                    j == 3 ||
                    j == 8 ||
                    j == 10 || j==7
                  ) {
                    continue;
                  }

                  document[j] = this.hex2a(
                    document[j].toString().replace("0x", "")
                  );
                }

                if (
                  document[3].toString().replace("0x", "") ==
                  this.props.userData.userAddress.replace("0x", "")
                ) {
                  instance
                    .users("0x" + document[4])
                    .then(user => {
                      document.push(
                        this.hex2a(user[5].toString().replace("0x", ""))
                      );
                      let newstate = { ...this.state };
                      newstate.list.push(document);
                      this.setState(newstate, () => {
                        if (this.totalCount - 1 == this.state.list.length) {
                          //   window.$("#table").DataTable();
                        }
                      });
                    })

                    .catch(err => {
                      let newstate = { ...this.state };
                      newstate.list.push(document);
                      this.setState(newstate, () => {
                      });
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


  async downloadFile(){
    var fileBuffer = ""
    var ls = this.state.list[this.state.selected][7].split(",")
    console.log(ls)
    for(var index=0; index<ls.length; index++){
      const fd = new FormData();
      fd.append('chunk', ls[index]);
      await fetch("http://blockchain-cloud.atwebpages.com/download.php", {method: 'post', body: fd}).then(res => { return res.text() }).then(data => {
        fileBuffer = fileBuffer + JSON.parse(data)["chunk"]
        console.log(fileBuffer)
        if(index == ls.length-1){
          const elementT = document.createElement("a");
          const file = new Blob([fileBuffer], {type: 'text/plain'});
          elementT.href = URL.createObjectURL(file);
          elementT.download = this.state.list[this.state.selected][5];
          document.body.appendChild(elementT);
          elementT.click();
       }
      }  
    );}
  
      
  }

  render() {
    console.log(this.state.selected >= 0 && this.state.previewModal ? this.state.list[this.state.selected]: (
      ""
    ))

    return (
      <Aux>
        <MainLayout userData={this.props.userData}>
          <h3 style={{ width: "100%" }}>
            <center>My Files</center>
          </h3>
          <br />
          <br />
          <br />
          <div style={{ margin: "20px", width: "100%" }}>
            {this.state.list.length > 0 ? (
              <Aux>
                <table id="table">
                  <thead>
                    <tr>
                      <td>S. No</td>
                      <td>Document Name</td>
                      <td>View</td>
                      <td>Download</td>
                       
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.map((element, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{element[1]}</td>

                          <td>
                            <a
                              href="javascript:;"
                              onClick={() => {
                                this.setState({
                                  selected: index,
                                  previewModal: true
                                });
                              }}
                            >
                              View
                            </a>
                          </td>
                          <td>
                          <a
                              href="javascript:;"
                              onClick={() => {
                                this.setState({
                                  selected: index,
                                }, ()=>{
                                  this.downloadFile()
                                });
                              }}
                            >
                          Download
                          </a>
                          </td>
                         
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Aux>
            ) : (
              <center>
                {" "}
                <a
                  href="javascript:;"
                  className="button special"
                  onClick={this.getAccountHandler}
                >
                  Get Files
                </a>{" "}
              </center>
            )}
          </div>
        </MainLayout>
        {this.state.selected >= 0 && this.state.previewModal ? (
          <PreviewModal
            closeHandler={() => {
              this.setState({ selected: -1, previewModal: false });
            }}
            userData={this.props.userData}
            certData={{
              Recipient: this.state.list[this.state.selected][3],
              userAddress: this.state.list[this.state.selected][4],
              DocumentName: this.state.list[this.state.selected][1],
              Score: this.state.list[this.state.selected][6].c[0],
              Dated: this.state.list[this.state.selected][7],
              Name: "",
              issuerName: "",
              qr: "",
              domain: "",
              isuserVerified: false,
              certificateID: this.state.list[this.state.selected][0].c[0]
            }}
          />
        ) : (
          ""
        )}
      </Aux>
    );
  }
}

export default ViewMyCertificates;
