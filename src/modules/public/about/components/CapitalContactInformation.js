import React from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Grid, Header, Button, Form, Modal, Divider } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form';

import NSImage from '../../../shared/NSImage';

const ThanksNote = props => (
  <Modal open size="mini" closeIcon closeOnDimmerClick={false} onClose={props.closeModal}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3">Thank you!</Header>
      <p>We appreciate you contacting us.</p>
      <Divider hidden />
    </Modal.Header>
  </Modal>
);
@inject('commonStore', 'uiStore')
@observer
export default class CapitalContactInformation extends React.Component {
  constructor(props) {
    super(props);
    this.props.commonStore.resetFormData('CONTACT_INFO_FRM');
    this.state = {
      modal: false,
    };
  }

  handleSubmit = () => {
    this.props.commonStore.fundNotificationSignUp().then(() => {
      this.setState({ modal: true });
    });
  }

  handleClose = () => {
    this.setState({ modal: false });
    this.props.commonStore.resetFormData('CONTACT_INFO_FRM');
  }

  render() {
    const { responsiveVars, inProgress } = this.props.uiStore;
    const { CONTACT_INFO_FRM, formChange } = this.props.commonStore;
    if (this.state.modal) {
      return (<ThanksNote closeModal={this.handleClose} />);
    }

    return (
      <Card fluid>
        <Card.Content className={responsiveVars.isMobile ? '' : 'pt-0 pb-0 plr-0'}>
          <Grid stackable className="mt-0 mb-0 mlr-0">
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8}>
              <section className={`investment_stat_box ${responsiveVars.isMobile ? '' : 'padded'}`}>
                <Header as="h2" className="capital-header">Contact Information</Header>
                <p>bharat@nextseed.com | 832.533.2700</p>
              </section>
              <section>
                <Grid>
                  <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} floated="right">
                    <NSImage
                      floated="right"
                      path={responsiveVars.isMobile ? 'capital/bharatMobile.png' : 'capital/bharat.png'}
                      className="mb-0"
                    />
                  </Grid.Column>
                  <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8} floated="left">
                    <p className="capital-header">Bharat Kesavan</p>
                    <p className="capital-header">Portfolio Principal</p>
                    <p>NextSeed Capital</p>
                  </Grid.Column>
                </Grid>
              </section>
            </Grid.Column>
            <Grid.Column width={responsiveVars.uptoTablet ? 16 : 8}>
              <section className={`investment_stat_box ${responsiveVars.isMobile ? '' : 'padded'}`}>
                <p>I want to be notified when the Fund is accepting investments</p>
                <Grid>
                  <Grid.Row>
                    <Form onSubmit={this.handleSubmit}>
                      <Grid.Column computer={12} tablet={12} mobile={16}>
                        <FormInput
                          name="emailAddress"
                          fielddata={CONTACT_INFO_FRM.fields.emailAddress}
                          changed={(e, result) => formChange(e, result, 'CONTACT_INFO_FRM')}
                        />
                      </Grid.Column>
                      <Grid.Column computer={4} tablet={4} mobile={16}>
                        <Button className="grey-colored" loading={inProgress}>Notify Me</Button>
                      </Grid.Column>
                    </Form>
                  </Grid.Row>
                </Grid>
              </section>
            </Grid.Column>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}
