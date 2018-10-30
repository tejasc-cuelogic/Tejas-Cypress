import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Divider } from 'semantic-ui-react';

@inject('investmentStore')
@observer
export default class DocSign extends React.Component {
  componentWillMount() {
    const { investAccTypes } = this.props.investmentStore;
    if (investAccTypes.value === '') {
      this.props.history.push('invest-now');
    }
  }
  handleCloseModal = () => {
    this.props.history.push('agreement');
  }
  render() {
    const { agreementDetails } = this.props.investmentStore;
    return (
      <Modal size="large" open closeIcon closeOnRootNodeClick={false} onClose={this.handleCloseModal}>
        <Modal.Content className="signup-content center-align">
          <div className="pdf-viewer">
            <iframe onLoad={this.iframeLoading} width="100%" height="100%" title="agreement" src={agreementDetails && agreementDetails.docuSignViewURL} />
          </div>
          <Divider hidden />
        </Modal.Content>
      </Modal>
    );
  }
}
