import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Grid } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';

@inject('elasticSearchStore')
@observer
export default class EsAudit extends Component {
  componentWillMount() {
    this.props.elasticSearchStore.resetForm('ES_AUDIT_FRM');
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { ES_AUDIT_FRM, formChange } = this.props.elasticSearchStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">ES Audit</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.onSubmit}>
            <Button floated="right" primary size="large" className="very relaxed" content="Set new password" />
            <FormInput
              name="random"
              fielddata={ES_AUDIT_FRM.random}
              changed={(e, result) => formChange(e, result, 'ES_AUDIT_FRM')}
            />
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <p>Mobile</p>
                </Grid.Column>
                <Grid.Column>
                  <p>Tablet</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
