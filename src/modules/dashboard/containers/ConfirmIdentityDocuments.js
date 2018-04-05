import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider, Popup, Icon, Grid } from 'semantic-ui-react';

export default class ConfirmIdentityDocuments extends Component {
  render() {
    return (
      <Modal size="tiny" open closeIcon onClose={() => this.props.setDashboardWizardStep()}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">We need to confirm your identity</Header>
          <Divider />
          <p>
            Please upload two valid identity documents or<br />
            <Link to="/app/dashboard" onClick={() => this.props.setDashboardWizardStep('InvestorPersonalDetails')}>update your SSN number</Link>
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form onSubmit={this.handleSubmitForm} className="file-uploader-inline">
            <Grid divided="vertically">
              <Grid.Row>
                <Grid.Column width={7}>
                  {/* eslint-disable jsx-a11y/label-has-for */}
                  <label>
                    <h3>Upload a Photo ID</h3>
                    Driving Liscence or passport
                  </label>
                </Grid.Column>
                <Grid.Column width={9}>
                  <div className="file-uploader">
                    <Icon name="upload" /> Choose a file <span>or drag it here</span>
                    <input type="file" />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={7}>
                  <label>
                    <h3>Proof of Residence
                      <Popup
                        trigger={<Icon name="help circle outline" />}
                        content="Put your first name as listed on your driver license"
                        position="top center"
                        className="center-align"
                      />
                    </h3>
                    Utility Bill or USPS change of address format
                  </label>
                </Grid.Column>
                <Grid.Column width={9}>
                  <div className="file-uploader">
                    <Icon name="upload" /> Choose a file <span>or drag it here</span>
                    <input type="file" />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Divider section hidden />
            <div className="center-align">
              <Button color="green" size="large" className="very relaxed">Verify my identity</Button>
            </div>
            <div className="center-align">
              <Button className="cancel-link" onClick={() => this.props.setDashboardWizardStep()}>I`ll finish this letter</Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
