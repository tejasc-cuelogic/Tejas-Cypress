import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../theme/form';

@inject('uiStore', 'userDetailsStore')
@withRouter
@observer
export default class DeleteUser extends Component {
  state = {
    errorMsg: '',
  }

  constructor(props) {
    super(props);
    this.props.userDetailsStore.resetForm('DELETE_MESSAGE');
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    const { match } = this.props;
    const { params } = match;
    this.props.history.push(`/app/users/${params.userId}/profile-data`);
  }

  handleDeleteProfile = () => {
    const isHardDelete = this.props.match.params.action === 'Hard';
    const redirectURL = isHardDelete ? '/app/users' : `/app/users/${this.props.match.params.userId}/profile-data`;
    this.props.userDetailsStore.deleteProfile(false, isHardDelete).then(() => {
      this.props.userDetailsStore.setFieldValue('selectedUserId', null);
      this.props.history.push(redirectURL);
    }).catch((res) => {
      this.setState({ errorMsg: res });
    });
  }

  render() {
    const { DELETE_MESSAGE_FRM, formChange } = this.props.userDetailsStore;
    const { inProgressArray } = this.props.uiStore;
    const { fields } = DELETE_MESSAGE_FRM;
    const { isValid } = DELETE_MESSAGE_FRM.meta;
    return (
      <Modal closeOnEscape={false} closeOnDimmerClick={false} size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Application?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error>
            <FormTextarea
              type="text"
              name="message"
              fielddata={fields.message}
              changed={(e, result) => formChange(e, result, 'DELETE_MESSAGE_FRM')}
              containerclassname="secondary"
            />
            <div className="center-align">
              <Button primary className="very relaxed" content="Submit" onClick={this.handleDeleteProfile} disabled={!isValid || inProgressArray.includes('deleteProfile')} loading={inProgressArray.includes('deleteProfile')} />
            </div>
            {this.state.errorMsg
              && <p className="negative-text right-align"><small>{this.state.errorMsg}</small></p>
            }
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
