import React from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { Menu, Button, Modal, Header, Divider } from 'semantic-ui-react';
import { InlineLoader } from '../shared';

@inject('userStore')
@observer
export default class DeleteUser extends React.Component {
  state = {
    modalOpen: false,
  }

  toggleModal = () => {
    this.setState({ modalOpen: true });
    this.props.userStore.getUserDeleteMeta();
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  handleDeleteUser = () => {
    // this.props.userStore.softDeleteUser();
    console.log('del here');
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
