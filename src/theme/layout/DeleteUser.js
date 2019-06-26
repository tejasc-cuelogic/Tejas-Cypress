import React from 'react';
import { observer, inject } from 'mobx-react';
import { Menu, Button, Modal, Header, Divider } from 'semantic-ui-react';
import { InlineLoader } from '../shared';

@inject('userStore', 'uiStore')
@observer
export default class DeleteUser extends React.Component {
  state = {
    modalOpen: false,
    msg: '',
  }

  toggleModal = () => {
    this.setState({ modalOpen: true });
    this.props.uiStore.setProgress();
    this.props.userStore.deleteUser().then((res) => {
      this.props.uiStore.setProgress(false);
      this.setState({ msg: res.message });
    });
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  handleDeleteUser = () => {
    console.log('del here');
  }

  render() {
    const { inProgress } = this.props.uiStore;
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
          {inProgress
            ? (<InlineLoader />)
            : (
    <Modal.Content>
            {this.state.msg
            && (
              <Header as="h4">{this.state.msg}</Header>
            )
            }
              <div className="center-align mt-30">
                <Button.Group>
                  <Button onClick={this.closeModal} type="button">Cancel</Button>
                  <Button content="Delete" color="red" onClick={this.handleDeleteUser()} />
                </Button.Group>
              </div>
          </Modal.Content>
            )
          }
        </Modal>
    );
  }
}
