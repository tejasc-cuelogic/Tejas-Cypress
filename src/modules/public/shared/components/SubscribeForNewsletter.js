import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Button, Form, Grid, Modal, Divider } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form';

const SubscribeFields = observer(({
  NEWSLETTER_FRM, newsLetterChange, modal, inProgress,
}) => (
  <Grid centered>
    <Grid.Row>
      {
        Object.keys(NEWSLETTER_FRM.fields).map(field => (
          <Grid.Column computer={4} tablet={5} mobile={16} key={field}>
            <FormInput
              key={field}
              type="text"
              name={field}
              fielddata={NEWSLETTER_FRM.fields[field]}
              changed={newsLetterChange}
              ishidelabel={!modal}
            />
          </Grid.Column>
        ))
      }
      <Grid.Column computer={2} tablet={3} mobile={16}>
        <Button primary loading={inProgress} fluid>
            Subscribe
        </Button>
      </Grid.Column>
    </Grid.Row>
  </Grid>
));

const ThanksNote = props => (
  <Modal open size="mini">
    <Modal.Header className="center-align signup-header">
      <Header as="h3">Thank you!</Header>
      <Divider section />
      <p>
        You&lsquo;ve be getting updates about new offerings, updates and events soon.
      </p>
      <Divider hidden />
    </Modal.Header>
    <div className="center-align">
      <Button onClick={props.closeModal} primary size="medium">Close</Button>
    </div>
    <Divider hidden />
  </Modal>
);

@inject('authStore', 'uiStore')
@observer
export default class SubscribeForNewsletter extends Component {
  state = { dialog: false };
  componentWillUnmount() {
    this.setState({ dialog: false });
  }
  closeModal = () => this.setState({ dialog: false });
  submit = () => {
    this.props.authStore.subscribeToNewsletter().then(() => {
      this.setState({ dialog: true });
      document.getElementsByName('subscriberName')[0].value = '';
      document.getElementsByName('emailAddress')[0].value = '';
    });
  }
  render() {
    const { NEWSLETTER_FRM, newsLetterChange } = this.props.authStore;
    const { inProgress } = this.props.uiStore;
    const { dialog } = this.state;
    return (
      <Aux>
        <Form onSubmit={this.submit} className={this.props.className}>
          {this.props.modal ? (
            <SubscribeFields
              NEWSLETTER_FRM={NEWSLETTER_FRM}
              newsLetterChange={newsLetterChange}
              modal={this.props.modal}
              inProgress={inProgress}
            />
          ) : (
            <SubscribeFields
              NEWSLETTER_FRM={NEWSLETTER_FRM}
              newsLetterChange={newsLetterChange}
              modal={this.props.modal}
              inProgress={inProgress}
            />
          )}
        </Form>
        {dialog && <ThanksNote closeModal={this.closeModal} />}
      </Aux>
    );
  }
}
