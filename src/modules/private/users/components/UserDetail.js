import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Label, Card, Header, Button, Checkbox, Feed } from 'semantic-ui-react';
import Spinner from '../../../../theme/ui/Spinner';
import { US_STATES } from '../../../../constants/account'; //  added Temperarily to update UI as per new layout
import { FormSelect } from '../../../../theme/form/FormElements';

const states = {
  label: 'State',
  error: undefined,
};

const userDetails = (props) => {
  if (!props.details || !props.details.id) {
    return (
      <div>
        <Spinner loaderMessage="Loading..." />
      </div>
    );
  }

  const { legalAddress } = props.details.legalDetails;
  const { phone } = props.details.contactDetails;
  return (
    <div className="content-spacer">
      {/* <div className={`overlay ${(props.editCard) ? 'editing' : ''}`} /> */}
      <Grid columns={1} stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Personal Profile</Header>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input fluid label="First name" placeholder="First name" value={props.details.firstName || ''} />
                    <Form.Input fluid label="Last name" placeholder="Last name" value={props.details.lastName || ''} />
                  </Form.Group>
                  <Form.Input fluid label="Phone number" placeholder="Phone number" defaultValue={(phone) ? phone.number : ''} />
                  <Header as="h4">Mailing Address</Header>
                  <Form.Input fluid label="Residendial Street" placeholder="Residendial Street" defaultValue={legalAddress ? legalAddress.street1 : ''} />
                  <Form.Group widths="equal">
                    <Form.Input fluid label="City" placeholder="City" defaultValue={legalAddress ? legalAddress.city : ''} />
                    <FormSelect label="State" name="state" fielddata={states} options={US_STATES} defaultValue={legalAddress ? legalAddress.state : ''} />
                    <Form.Input fluid label="ZIP code" placeholder="ZIP code" defaultValue={legalAddress ? legalAddress.zipCode : ''} />
                  </Form.Group>
                  <Button inverted color="green">Update profile info</Button>
                </Form>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Verified identity</Header>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Input fluid label="Legal First name" placeholder="Legal First name" readOnly value={props.details.firstLegalName || ''} />
                    <Form.Input fluid label="Legal Last name" placeholder="Legal Last name" readOnly value={props.details.lastLegalName || ''} />
                  </Form.Group>
                  <Form.Input fluid label="SSN" placeholder="SSN" readOnly defaultValue={props.details.legalDetails.ssn} />
                  <Form.Input fluid label="Date of Birth" placeholder="Date of Birth" readOnly defaultValue={props.details.legalDetails.dateOfBirth} />
                  <Form.Input fluid label="Legal Address" placeholder="Legal Address" readOnly defaultValue={legalAddress ? legalAddress.street1 : ''} />
                  <Form.Input fluid label="Email" placeholder="Email" readOnly defaultValue={props.details.email} />
                  <Button inverted color="green" disabled>Update identity</Button>
                </Form>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={8}>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Activity</Header>
                <Form>
                  <Form.Field inline>
                    <Checkbox label="User activity" />
                    <Checkbox label="Admin activity" />
                  </Form.Field>
                </Form>
              </Card.Content>
              <Feed className="activities">
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>4/16/18 at 3:21pm</Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> created <b>IRA account</b>
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>1 week ago <Label horizontal size="tiny">By Admin</Label></Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> transfered <b>$1000</b> to his bank account
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>2 weeks ago</Feed.Date>
                    <Feed.Extra text>
                      <b>Admin Anna Adams</b> updated <b>First Legal Name</b>
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>1 week ago</Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> transfered <b>$1000</b> to his bank account
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>2 weeks ago</Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> created <b>IRA account</b>
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>1 weeks ago</Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> transfered <b>$1000</b> to his bank account
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>2 weeks ago</Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> created <b>IRA account</b>
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content>
                    <Feed.Date>1 weeks ago</Feed.Date>
                    <Feed.Extra text>
                      <b>Joe Smith</b> transfered <b>$1000</b> to his bank account
                    </Feed.Extra>
                  </Feed.Content>
                </Feed.Event>
                <Feed.Event>
                  <Feed.Content className="center-align">
                    <Feed.Summary>
                      <Link to="">Show more</Link>
                    </Feed.Summary>
                  </Feed.Content>
                </Feed.Event>
              </Feed>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default userDetails;
