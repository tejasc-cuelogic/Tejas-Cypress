import React from 'react';
import { get } from 'lodash';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, Modal, Header, Message, Form } from 'semantic-ui-react';
import { InlineLoader, ListErrors } from '../../../../../../theme/shared';
import { authActions } from '../../../../../../services/actions';
// import { FormInput } from '../../../../../../theme/form';

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
    this.props.userStore.userReset();
    this.props.userStore.handleCancelDeleteUser(false);
    this.props.userStore.setFieldValue('deleteUser', false);
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

  backToOfferings = () => {
    this.props.history.push('/');
  }

  render() {
    const { getDeleteUserMeta, deleteUserLoading, USR_FRM, userEleChange, deleteUser, handleCancelDeleteUser } = this.props.userStore;
    const { inProgressArray } = this.props.uiStore;
    return (
      <Modal
        closeIcon
        open={this.state.modalOpen}
        onClose={this.closeModal}
        trigger={(
            <Button color="green" className="link-button" onClick={() => this.toggleModal(true)} content="Delete your NextSeed Account" />
          )}
        size="mini"
        closeOnDimmerClick={false}
      >
          {deleteUserLoading
            ? (<InlineLoader />)
            : (
          <Modal.Content className="center-align">
            <Header as="h4" className="mt-30">{get(getDeleteUserMeta, 'header')}</Header>
            {get(getDeleteUserMeta, 'message')}
            {this.state.failMessage
            && (
              <Message error className="mt-30">
                <ListErrors errors={[this.state.failMessage]} />
              </Message>
            )
            }
            {get(getDeleteUserMeta, 'isValidForDelete') && (
              <>
                <Form className="left-align mt-50 mb-40">
                  <Form.Input
                    fluid
                    label="E-mail"
                    type="text"
                    name="email"
                    fielddata={USR_FRM.fields.email}
                    onChange={(e, res) => userEleChange(e, res, 'text', true)}
                  />
                </Form>
                <div className="center-align mt-30">
                  <Button content="No thanks, I'll stay!" color="green" loading={inProgressArray.includes('deleteProfile')} onClick={() => handleCancelDeleteUser(true)} />
                  <Button color="green" className="link-button mt-30" onClick={this.handleDeleteUser} type="button" disabled={!deleteUser}>Yes, please delete my NextSeed account</Button>
                </div>
              </>
            )}
            {get(getDeleteUserMeta, 'isCancelDelete') && (
              <>
                <Button content="Browse Offerings" color="green" loading={inProgressArray.includes('deleteProfile')} onClick={() => this.backToOfferings()} /><br /><br />
              </>
            )}
          </Modal.Content>
            )
          }
        </Modal>
    );
  }
}
