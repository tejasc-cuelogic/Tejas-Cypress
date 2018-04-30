import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Form, Label, Card, Header, Button, Checkbox, Feed, Divider, Statistic, Popup, Icon, Input } from 'semantic-ui-react';
import Spinner from '../../../theme/ui/Spinner';
// import ToggleEdit from './ToggleEdit';
import { US_STATES } from '../../../constants/account'; //  added Temperarily to update UI as per new layout
import { FormSelect } from '../../../components/form/FormElements';

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

        {/* <Grid.Row>
          <Grid.Column>
            <div className={`form-card card editable ${(props.editCard === 1) ? 'editing' : ''}`}>
              <ToggleEdit card={1} title="Names" setEditCard={props.setEditCard}
              save={props.save} editCard={props.editCard} />
              <Form>
                <Grid columns={2} divided stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <h4>Name</h4>
                      <div>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>First Name</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text" value={props.details.firstName || ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Middle Name</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text" value="" readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Last Name</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text" value={props.details.lastName || ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <h4>Legal Name</h4>
                      <div>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>First Name</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            value={(legalName) ? legalName.firstLegalName : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Middle Name</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text" value="" readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Last Name</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalName ? legalName.lastLegalName : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <div className={`form-card card editable ${(props.editCard === 2) ? 'editing' : ''}`}>
              <ToggleEdit card={2} title="DOB & SSN"
              setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
              <Form>
                <Form.Group>
                  <Form.Field width={8}>
                    <Label>Date of Birth</Label>
                  </Form.Field>
                  <Form.Field width={8}>
                    <Input type="text" defaultValue={props.details.legalDetails.dateOfBirth} />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.Field width={8}>
                    <Label>SSN number</Label>
                  </Form.Field>
                  <Form.Field width={8}>
                    <Input type="text" defaultValue={props.details.legalDetails.ssn} />
                  </Form.Field>
                </Form.Group>
              </Form>
            </div>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className={`form-card card editable ${(props.editCard === 3) ? 'editing' : ''}`}>
              <ToggleEdit card={3} title="Email & Password"
              setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
              <Form>
                <Form.Group>
                  <Form.Field width={8}>
                    <Label>E-mail Address</Label>
                  </Form.Field>
                  <Form.Field width={8}>
                    <Input type="email" defaultValue={props.details.email} readOnly />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.Field width={8}>
                    <Label>Password</Label>
                  </Form.Field>
                  <Form.Field width={8}>
                    <Input type="password" defaultValue="TestP@ssword" readOnly />
                  </Form.Field>
                </Form.Group>
              </Form>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <div className={`form-card card editable ${(props.editCard === 4) ? 'editing' : ''}`}>
              <ToggleEdit card={4} title="Addresses"
              setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
              <Form>
                <Grid columns={2} divided stackable>
                  <Grid.Row>
                    <Grid.Column>
                      <h4>Residence Address</h4>
                      <div>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Street 1</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.street1 : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Street 2</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.street2 : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>City</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.city : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>State</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.state : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>ZIP code</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.zipCode : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                      </div>
                    </Grid.Column>
                    <Grid.Column>
                      <h4>Mailing Address</h4>
                      <div>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Street 1</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.street1 : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>Street 2</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.street2 : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>City</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.city : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>State</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.state : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                        <Form.Group>
                          <Form.Field width={8}>
                            <Label>ZIP code</Label>
                          </Form.Field>
                          <Form.Field width={8}>
                            <Input type="text"
                            defaultValue={legalAddress ? legalAddress.zipCode : ''} readOnly />
                          </Form.Field>
                        </Form.Group>
                      </div>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <div className={`form-card card editable ${(props.editCard === 5) ? 'editing' : ''}`}>
              <ToggleEdit card={5} title="Phone Numbers"
              setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
              <Form>
                <Form.Group>
                  <Form.Field width={8}>
                    <Label>Phone number</Label>
                  </Form.Field>
                  <Form.Field width={8}>
                    <Input type="tel" defaultValue={(phone) ? phone.number : ''} readOnly />
                  </Form.Field>
                </Form.Group>
              </Form>
            </div>
          </Grid.Column>
        </Grid.Row> */}
      </Grid>
      <Divider section />
      <Header as="h3">Regulation Crowdfunding Limits</Header>
      <Grid columns={1} stackable>
        <Grid.Row>
          <Grid.Column width={8}>
            <Card fluid>
              <Grid divided padded="horizontally">
                <Grid.Row>
                  <Grid.Column width={6}>
                    <Card.Content>
                      <Statistic size="tiny">
                        <Statistic.Label>
                          Your current investment limit
                          <Popup
                            trigger={<Icon name="ns-help-circle outline" />}
                            content="Your current investment limit as of today"
                            position="top center"
                            className="center-align"
                          />
                        </Statistic.Label>
                        <Statistic.Value>$80,200</Statistic.Value>
                      </Statistic>
                    </Card.Content>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Card.Content>
                      <Form>
                        <Form.Field>
                          {/* eslint-disable jsx-a11y/label-has-for */}
                          <label>Annual income</label>
                          <Input
                            label={{ basic: true, content: '$' }}
                            labelPosition="left"
                            fluid
                            placeholder="Annual income"
                            defaultValue="80,000"
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>Net Worth</label>
                          <Input
                            label={{ basic: true, content: '$' }}
                            labelPosition="left"
                            fluid
                            placeholder="Net Worth"
                            defaultValue="50,000"
                          />
                        </Form.Field>
                        <Form.Field>
                          <label>
                            Other Regulation Crowdfunding investments made in prior 12 months
                          </label>
                          <Input
                            label={{ basic: true, content: '$' }}
                            labelPosition="left"
                            fluid
                            placeholder="Other Regulation Crowdfunding investments made in prior 12 months"
                            defaultValue="0"
                          />
                        </Form.Field>
                        <Button inverted disabled color="green">Update financial info</Button>
                      </Form>
                    </Card.Content>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default userDetails;
