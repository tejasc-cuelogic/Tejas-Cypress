import React from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Header, Divider, Message } from 'semantic-ui-react';
import { InlineLoader, ListErrors } from '../../../../../../theme/shared';
import { authActions } from '../../../../../../services/actions';

@inject('userStore', 'userDetailsStore', 'uiStore')
@withRouter
@observer
export default class DeleteUser extends React.Component {
  state = {
    modalOpen: false,
    failMessage: false,
  }

  toggleModal = () => {
    this.setState({ modalOpen: true });
    this.props.userStore.getUserDeleteMeta();
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  handleDeleteUser = () => {
    this.props.userDetailsStore.deleteProfile(true).then(() => {
      this.setState({ failMessage: false });
      authActions.logout('user').then(() => {
        this.props.history.push('/');
      });
    }).catch(msg => this.setState({ failMessage: msg }));
  }

  render() {
    const { getDeleteUserMeta, deleteUserLoading } = this.props.userStore;
    const { inProgressArray } = this.props.uiStore;
    return (
      <Modal
        closeIcon
        open={this.state.modalOpen}
        onClose={this.closeModal}
        trigger={(
            <Button color="green" inverted onClick={() => this.toggleModal(true)} content="Delete" />
          )}
        size="mini"
        closeOnDimmerClick={false}
      >
          <Modal.Header className="center-align signup-header">
            <Header as="h3">Delete User Account</Header>
            <Divider />
          </Modal.Header>
          {deleteUserLoading
            ? (<InlineLoader />)
            : (
          <Modal.Content>
            {get(getDeleteUserMeta, 'message')
            && (
              <Header as="h5">{get(getDeleteUserMeta, 'message')}</Header>
            )
            }
            {this.state.failMessage
            && (
              <Message error className="mt-30">
                <ListErrors errors={[this.state.failMessage]} />
              </Message>
            )
          }
              <div className="center-align mt-30">
                <Button.Group>
                  <Button onClick={this.closeModal} type="button">Cancel</Button>
                  <Button content="Delete" color="red" loading={inProgressArray.includes('deleteProfile')} onClick={this.handleDeleteUser} disabled={!get(getDeleteUserMeta, 'isValidForDelete')} />
                </Button.Group>
              </div>
          </Modal.Content>
            )
          }
        </Modal>
    );
  }
}
