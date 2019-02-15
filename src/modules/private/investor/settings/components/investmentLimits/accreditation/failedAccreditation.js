import React, { Component } from 'react';
import { Modal, Button, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('accreditationStore')
@observer
export default class failedAccreditation extends Component {
  render() {
    const { accType } = this.props.accreditationStore;
    return (
      <Modal closeIcon onClose={() => { this.props.closeModal(); this.props.accreditationStore.setFieldVal('accType', ''); }} closeOnDimmerClick={false} size="mini" open >
        <Modal.Content>
          <Header as="h4" className="mt-20" textAlign="center">
          Unfortunately, we are not able to verify your accredited investor status based on your
          selection.
          </Header>
          <p className="center-align mt-30 mb-30">
            {accType === 'trust' ?
          'If your trust`s status changes to meet the criteria, please return to verify your status.' : accType === 'nonTrust' ?
          'If your entity`s status changes to meet the criteria, please return to verify your status.' :
            'If your income or net worth change to meet the criteria, please return to verify your status.'
          }
          </p>
          <div className="center-align mt-30">
            <Button primary className="very relaxed" content="OK" onClick={() => { this.props.closeModal(); this.props.accreditationStore.setFieldVal('accType', ''); }} />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
