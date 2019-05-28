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
            <Grid>
              <Grid.Row className="mb-20">
                <Grid.Column width={10}>
                  <FormInput
                    name="random"
                    fielddata={ES_AUDIT_FRM.fields.random}
                    changed={(e, result) => formChange(e, result, 'ES_AUDIT_FRM')}
                  />
                </Grid.Column>
                <Grid.Column width={6} verticalAlign="middle">
                  <Button primary content="Submit" />
                </Grid.Column>
              </Grid.Row>
              <Divider section />
              <Grid.Row columns={2} divided className="mt-20">
                <Grid.Column>
                  <Header as="h4">
                    Output:
                    <Header.Subheader className="mt-10">Document Id: XYZ</Header.Subheader>
                  </Header>
                </Grid.Column>
              </Grid.Row>
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
