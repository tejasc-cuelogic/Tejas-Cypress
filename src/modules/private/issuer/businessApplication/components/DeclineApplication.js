/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';
import { Modal, Header, Button, Form, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { FormTextarea } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';

@inject('uiStore', 'businessAppReviewStore')
@withRouter
@observer
export default class DeclineApplication extends Component {
  componentWillMount() {
  }
  handleCloseModal = () => {
    this.props.history.push(`/app/dashboard/${this.props.match.params.applicationId}/offers`);
  }
  render() {
    const { uiStore, businessAppReviewStore } = this.props;
    const { APPLICATION_STATUS_COMMENT_FRM, formChange } = businessAppReviewStore;
    const { fields } = APPLICATION_STATUS_COMMENT_FRM;
    const { errors, inProgress } = uiStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="medium" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Decline NextSeed Offers</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <p>
            We're sorry you won't be moving forward with a campaign.
            We'd still love to work with you in the future!
          </p>
          <p>If you have a minute, we'd greatly appreciate any feedback on what we could do
            to improve. Please share your thoughts on what you would have preferred to see
            and what the primary reasons are that you have decided not to launch a
            NextSeed campaign.
          </p>
          <Form error>
            <FormTextarea
              type="text"
              name="text"
              fielddata={fields.text}
              changed={(e, result) => formChange(e, result, 'APPLICATION_STATUS_COMMENT_FRM')}
              containerclassname="secondary"
            />
            {errors &&
              <Message error>
                <ListErrors errors={[errors]} />
              </Message>
            }
            <div className="center-align">
              <Button.Group>
                <Button primary disabled={!APPLICATION_STATUS_COMMENT_FRM.meta.isValid} loading={inProgress} content="Yes - Decline Offer" onClick={this.handleCloseModal} />
                <Button color="red" content="No - Back to Offers" onClick={this.handleCloseModal} />
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
