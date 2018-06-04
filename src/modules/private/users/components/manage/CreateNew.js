import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Grid, Card, Form, Button } from 'semantic-ui-react';
import adminActions from '../../../../../actions/admin';
import { FormInput, FormSelect } from '../../../../../theme/form/FormElements';
import { ROLES } from '../../../../../constants/user';

@inject('userStore', 'uiStore')
@withRouter
@observer
export default class CreateNew extends Component {
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
      <Grid columns={1} stackable>
        <Grid.Row>
          <Grid.Column width={8}>
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
                    ['email', 'TemporaryPassword'].map(field => (
                      <FormInput
                        key={field}
                        type="text"
                        name={field}
                        fielddata={USR_FRM.fields[field]}
                        changed={userEleChange}
                      />
                    ))
                  }
                  <FormSelect
                    containerwidth={6}
                    name="Role"
                    fielddata={USR_FRM.fields.role}
                    options={ROLES}
                    multiple
                    changed={userEleChange}
                  />
                  <div>
                    <Button loading={inProgress} disabled={!USR_FRM.meta.isValid} size="large" color="green" className="very relaxed">Submit</Button>
                    <p className="field-error">{USR_FRM.meta.error}</p>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
