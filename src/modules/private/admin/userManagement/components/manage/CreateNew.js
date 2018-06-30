import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Card, Form, Button } from 'semantic-ui-react';
import { adminActions } from '../../../../../../services/actions';
import { FormInput, FormSelect } from '../../../../../../theme/form';
import { ROLES } from '../../../../../../constants/user';

@inject('userStore', 'uiStore')
@withRouter
@observer
export default class CreateNew extends Component {
  componentWillMount() {
    this.props.userStore.userReset();
  }
  submit = (e) => {
    e.preventDefault();
    adminActions.createNewUser()
      .then(() => {
        this.props.history.push('/app/users');
      })
      .catch((err) => {
        console.log(err, 'Error:');
      });
  }

  render() {
    const { USR_FRM, userEleChange } = this.props.userStore;
    const { inProgress } = this.props.uiStore;
    return (
      <Aux>
        <Header as="h3">User Details</Header>
        <Card.Group stackable itemsPerRow={3}>
          <Card fluid>
            <Card.Content>
              <Header as="h3">Personal Profile</Header>
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
                <FormSelect
                  name="role"
                  fielddata={USR_FRM.fields.role}
                  options={ROLES}
                  multiple
                  changed={userEleChange}
                />
                <div>
                  <Button loading={inProgress} disabled={!USR_FRM.meta.isValid} color="green">Submit</Button>
                  <p className="field-error">{USR_FRM.meta.error}</p>
                </div>
              </Form>
            </Card.Content>
          </Card>
        </Card.Group>
      </Aux>
    );
  }
}
