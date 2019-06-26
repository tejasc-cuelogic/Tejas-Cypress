import React from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Menu, Button, Modal, Header, Divider, Message } from 'semantic-ui-react';
import { InlineLoader, ListErrors } from '../shared';

@inject('userStore', 'userDetailsStore')
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
    this.props.userDetailsStore.deleteProfile(true).then(() => this.setState({ failMessage: false })).catch(msg => this.setState({ failMessage: msg }));
  }

  render() {
    const { getDeleteUserMeta, deleteUserLoading } = this.props.userStore;
    return (
      <Modal
        closeIcon
        open={this.state.modalOpen}
        onClose={this.closeModal}
        trigger={(
            <Menu.Item className="btn-item mt-10">
              <Button color="red" fluid basic compact onClick={() => this.toggleModal(true)} content="Delete User" />
            </Menu.Item>
          )}
        size="tiny"
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
              <Header as="h4">{get(getDeleteUserMeta, 'message')}</Header>
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
                  <Button content="Delete" color="red" onClick={this.handleDeleteUser} disabled={!get(getDeleteUserMeta, 'isValidForDelete')} />
                </Button.Group>
              </div>
          </Modal.Content>
            )
          }
        </Modal>
    );
  }
}
