import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Grid, Divider, Card } from 'semantic-ui-react';
import { FormInput } from '../../../../../theme/form';

@inject('elasticSearchStore')
@observer
export default class EsAudit extends Component {
  componentWillMount() {
    const { auditAlias } = this.props.match.params;
    this.props.elasticSearchStore.getESAuditPara(auditAlias);
    this.props.elasticSearchStore.resetForm('ES_AUDIT_FRM');
  }
  onSubmit = () => {
    const { auditAlias } = this.props.match.params;
    this.props.elasticSearchStore.getESAuditPara(auditAlias);
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
            <Form.Group className="bottom-aligned mb-20">
              <FormInput
                containerwidth={10}
                name="random"
                fielddata={ES_AUDIT_FRM.fields.random}
                changed={(e, result) => formChange(e, result, 'ES_AUDIT_FRM')}
              />
              <Form.Field width={4}>
                <Button primary content="Submit" />
              </Form.Field>
            </Form.Group>
            <Header as="h4" className="mb-30 mt-20">
              Output:
              <Header.Subheader>Document Id: XYZ</Header.Subheader>
            </Header>
            <Grid>
              <Grid.Row columns={2} divided>
                <Grid.Column>
                  <Header as="h6">
                    Count: 1 <span className="ml-10">1 hr ago</span>
                  </Header>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <section className="bg-offwhite center-align">
                    <h3 className="grey-header">No data found</h3>
                  </section>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h6">
                    Count: 1 <span className="ml-10">1 hr ago</span>
                  </Header>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <section className="bg-offwhite center-align">
                    <h3 className="grey-header">No data found</h3>
                  </section>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
