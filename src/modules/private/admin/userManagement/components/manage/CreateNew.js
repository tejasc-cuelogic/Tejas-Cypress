import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Card, Form, Button, Item, Modal } from 'semantic-ui-react';
import { adminActions } from '../../../../../../services/actions';
import { FormInput, FormDropDown } from '../../../../../../theme/form';
import { ROLES } from '../../../../../../constants/user';

@inject('userStore', 'uiStore')
@withRouter
@observer
export default class CreateNew extends Component {
  constructor(props) {
    super(props);
    this.props.userStore.userReset();
  }

  submit = (e) => {
    e.preventDefault();
    adminActions.createNewUser()
      .then(() => {
        this.props.history.push('/dashboard/users');
      })
      .catch((err) => {
        console.log(err, 'Error:');
      });
  }

  handleCloseModal = () => this.props.history.push('/dashboard/users');

  render() {
    const { USR_FRM, userEleChange, capabilitiesMeta } = this.props.userStore;
    const { inProgress } = this.props.uiStore;
    return (
      <Modal closeIcon closeOnDimmerClick={false} size="tiny" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Item.Group>
            <Item className="user-intro">
              <Item.Content verticalAlign="middle">
                <Header as="h3">Add new user</Header>
              </Item.Content>
            </Item>
          </Item.Group>
          <Card fluid className="inner-content-spacer">
            <Form onSubmit={this.submit}>
              <Form.Group widths="equal">
                {
                  ['givenName', 'familyName'].map(field => (
                    <FormInput
                      key={field}
                      type="text"
                      name={field}
                      fielddata={USR_FRM.fields[field]}
                      changed={userEleChange}
                    />
                  ))
                }
              </Form.Group>
              {
                ['email', 'TemporaryPassword', 'verifyPassword'].map(field => (
                  <FormInput
                    key={field}
                    type={field !== 'email' ? 'password' : 'text'}
                    name={field}
                    fielddata={USR_FRM.fields[field]}
                    changed={userEleChange}
                  />
                ))
              }
              <FormDropDown
                name="role"
                fielddata={USR_FRM.fields.role}
                options={ROLES}
                multiple
                selection
                fluid
                containerclassname="dropdown-field"
                onChange={(e, res) => userEleChange(e, res, 'dropdown')}
              />
              {USR_FRM.fields.role.value.includes('admin') && (
                <FormDropDown
                  name="capabilities"
                  fielddata={USR_FRM.fields.capabilities}
                  options={capabilitiesMeta}
                  search
                  multiple
                  selection
                  fluid
                  containerclassname="dropdown-field"
                  onChange={(e, res) => userEleChange(e, res, 'dropdown')}
                />
              )}
              <div className="center-align mt-30">
                <Button primary className="relaxed" content="Submit" loading={inProgress} disabled={!USR_FRM.meta.isValid} />
                <p className="field-error mt-10">{USR_FRM.meta.error}</p>
              </div>
            </Form>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
