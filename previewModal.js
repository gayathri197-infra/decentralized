import React, { Component } from "react";
import Aux from "./auxf";
import PreviewPane from "./preview";
class PreviewModal extends Component {
  state = {};
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
  }
  render() {
    return (
      <Aux>
        <div id="myModal" className="modal">
          <div className="modal-content">
            <div className="modal-body">
              <PreviewPane
                certData={this.props.certData}
                userData={this.props.userData}
              />
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

export default PreviewModal;
