import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput } from '../../../../../../theme/form';

@inject('dataStore')
@withRouter
@observer
export default class ProcessTransferRequest extends Component {
  constructor(props) {
    super(props);
    this.props.dataStore.resetForm('PROCESS_TRANSFER_REQ_FRM');
  }

  onSubmit = () => {
    this.props.dataStore.processTransferRequest();
  }

  render() {
    const { dataStore } = this.props;
    const {
      PROCESS_TRANSFER_REQ_FRM, formChange, inProgress,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Process Transfer Requests" />
        <Card.Content>
          <Form onSubmit={this.onSubmit}>
            <Form.Group className="bottom-aligned">
              <FormInput
                type="text"
                key="transferId"
                name="transferId"
                containerwidth="8"
                showerror
                fielddata={PROCESS_TRANSFER_REQ_FRM.fields.transferId}
                changed={(e, result) => formChange(e, result, 'PROCESS_TRANSFER_REQ_FRM')}
              />
              <Form.Field width={16}>
                <Button primary content="Submit" disabled={!PROCESS_TRANSFER_REQ_FRM.meta.isValid || inProgress.processTransferRequest} loading={inProgress.processTransferRequest} />
              </Form.Field>
            </Form.Group>
          </Form>
        </Card.Content>
      </Card>
    );
  }
}
