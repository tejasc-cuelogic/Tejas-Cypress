import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Input, Card, Header, Button } from 'semantic-ui-react';
import { FormSelect } from '../../../../theme/form/FormElements';
import { US_STATES } from '../../../../constants/account'; //  added Temperarily to update UI as per new layout

const states = {
  label: 'State',
  error: undefined,
};

export default class ProfileData extends Component {
  render() {
    return (
      <Grid columns={1} stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Card fluid className="form-card">
              <Header as="h3">Personal Profile</Header>
              <Form>
                <Form.Group widths="equal">
                  <Form.Input fluid label="First name" placeholder="First name" value="NextSeed" />
                  <Form.Input fluid label="Last name" placeholder="Last name" value="Investor" />
                </Form.Group>
                <Form.Field>
                  {/* eslint-disable jsx-a11y/label-has-for */}
                  <label>Phone Number</label>
                  <Input
                    action={{ color: 'green', className: 'link-button', content: 'Change' }}
                    placeholder="Phone Number"
                    defaultValue="123-456-7890"
                  />
                </Form.Field>
                <Form.Field>
                  {/* eslint-disable jsx-a11y/label-has-for */}
                  <label>Email</label>
                  <Input
                    action={{ color: 'green', className: 'link-button', content: 'Change' }}
                    placeholder="Email"
                    defaultValue="nsinvestor@gmail.com"
                  />
                </Form.Field>
                <Header as="h4">Mailing Address</Header>
                <Form.Input fluid label="Residendial Street" placeholder="Residendial Street" value="123, East Street, Place" />
                <Form.Group widths="equal">
                  <Form.Input fluid label="City" placeholder="City" value="Atlanta" />
                  <FormSelect label="State" name="state" fielddata={states} options={US_STATES} />
                  <Form.Input fluid label="ZIP code" placeholder="ZIP code" />
                </Form.Group>
                <Button inverted color="green" disabled>Update profile info</Button>
              </Form>
            </Card>
          </Grid.Column>
          <Grid.Column width={5}>
            <Card.Group itemsPerRow={1}>
              <Card className="form-card">
                <h3>Profile Photo</h3>
                {/* <Randavatar name={this.props.UserInfo.fullname}
                avatarKey={this.props.UserInfo.avatarKey} size="small" /> */}
                <Link to=""><b>Change profile photo</b></Link>
              </Card>
              <Card className="form-card">
                <h3>Identity verified</h3>
                <dl className="dl-horizontal">
                  <dt>Legal First Name</dt>
                  <dd>Jonathan</dd>
                  <dt>Legal Last Name</dt>
                  <dd>Smith</dd>
                  <dt>SSN</dt>
                  <dd>XXX-XXX-2953</dd>
                  <dt>DOB</dt>
                  <dd>12-03-1986</dd>
                  <dt>Legal Address</dt>
                  <dd>Baker Street 221B<br />
                    New York, NY, 1001
                  </dd>
                  <dt>Email Address</dt>
                  <dd>joesmith@gmail.com</dd>
                </dl>
                <p className="intro-text">
                  If any of this information needs to be updated, please contact support through the{' '}
                  <Link to="" className="link"><b>Message center</b></Link>.
                </p>
              </Card>
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
