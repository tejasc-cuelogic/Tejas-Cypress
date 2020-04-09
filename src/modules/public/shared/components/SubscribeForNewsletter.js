import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Button, Form, Grid, Modal, Divider } from 'semantic-ui-react';
import formHOC from '../../../../theme/form/formHOC';

const metaInfo = {
  store: 'authStore',
  form: 'NEWSLETTER_FRM',
};

const SubscribeFields = observer(({
  NEWSLETTER_FRM, modal, inProgress, smartElement,
}) => (
  <Grid centered>
    <Grid.Row>
      {
        Object.keys(NEWSLETTER_FRM.fields).map(field => (
          <Grid.Column computer={12} tablet={12} mobile={16} key={field}>
          {smartElement.Input(field, { ishidelabel: !modal, showerror: true })}
          </Grid.Column>
        ))
      }
      <Grid.Column computer={4} tablet={4} mobile={16}>
        <Button primary loading={inProgress} fluid>
            Subscribe
        </Button>
      </Grid.Column>
    </Grid.Row>
  </Grid>
));

const ThanksNote = props => (
  <Modal open size="mini" closeIcon closeOnDimmerClick={false} onClose={props.closeModal}>
    <Modal.Header className="center-align signup-header">
      <Header as="h3">Thank you!</Header>
      <Divider section />
      <p>
        We&lsquo;ll keep you informed about new investment<br />
        opportunities, updates and events.
      </p>
      <Divider hidden />
    </Modal.Header>
  </Modal>
);

class SubscribeForNewsletter extends Component {
  state = { dialog: false };

  componentWillUnmount() {
    this.setState({ dialog: false });
    this.props.authStore.resetForm('NEWSLETTER_FRM');
  }

  closeModal = () => this.setState({ dialog: false });

  submit = () => {
    this.props.authStore.subscribeToNewsletter().then(() => {
      this.setState({ dialog: true });
      // document.getElementsByName('subscriberName')[0].value = '';
      document.getElementsByName('emailAddress')[0].value = '';
    }).catch(() => {
      // do nothing
    });
  }

  render() {
    const { NEWSLETTER_FRM, newsLetterChange } = this.props.authStore;
    const { inProgress } = this.props.uiStore;
    const { dialog } = this.state;
    const { smartElement } = this.props;
    return (
      <>
        <Form onSubmit={this.submit} className={this.props.className}>
          {this.props.modal ? (
            <SubscribeFields
              NEWSLETTER_FRM={NEWSLETTER_FRM}
              newsLetterChange={newsLetterChange}
              modal={this.props.modal}
              inProgress={inProgress}
              smartElement={smartElement}
            />
          ) : (
            <SubscribeFields
              NEWSLETTER_FRM={NEWSLETTER_FRM}
              newsLetterChange={newsLetterChange}
              modal={this.props.modal}
              inProgress={inProgress}
              smartElement={smartElement}
            />
          )}
        </Form>
        {dialog && <ThanksNote closeModal={this.closeModal} />}
      </>
    );
  }
}
export default inject('authStore', 'uiStore')(formHOC(observer(SubscribeForNewsletter), metaInfo));
