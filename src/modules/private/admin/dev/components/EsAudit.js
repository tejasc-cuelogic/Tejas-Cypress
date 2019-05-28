import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Grid } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';

@inject('authStore', 'uiStore')
@observer
export default class EsAudit extends Component {
  componentWillMount() {
    // this.props.authStore.resetForm('CHANGE_PASS_FRM');
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
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
              fielddata={{ name: 'random', value: 'radnom', label: 'Random' }}
              // changed={changePassChange}
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
