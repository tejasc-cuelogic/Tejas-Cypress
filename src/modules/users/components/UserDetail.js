import React from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Grid, Icon, Form, Input, Label, Button } from 'semantic-ui-react';

const userDetails = props => (
  <div className="content-spacer">
    <div className={`overlay ${(props.editCard) ? 'editing' : ''}`} />
    <Grid columns={1} stackable>
      <Grid.Row>
        <Grid.Column>
          <div className="form-card card editable">
            <h3>Names</h3>
            <div className="actions">
              {/* <Link to="/edit" className="negative">Cancel</Link>
              <Button circular color="green" size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="pencil" />Edit</Link>
            </div>
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
                          <Input type="text" value={props.user.firstName || ''} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Middle Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" value={props.user.middleName || ''} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Last Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" value={props.user.lastName || ''} readOnly />
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
                          <Input type="text" defaultValue={props.details.legalDetails.legalName.firstLegalName} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Middle Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Last Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalName.lastLegalName} readOnly />
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
            <h3>DOB & SSN</h3>
            <div className="actions">
              {(props.editCard === 2) ? (
                <Aux>
                  <Button onClick={() => props.setEditCard(0)} className="negative">Cancel</Button>
                  <Button onClick={props.save} circular color="green" size="mini" to=""><Icon name="check" />Save</Button>
                </Aux>
              ) : (
                <Aux>
                  <Button onClick={() => props.setEditCard(2)}><Icon name="pencil" />Edit</Button>
                </Aux>
              )
              }
            </div>
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
          <div className="form-card card editable">
            <h3>Email & Password</h3>
            <div className="actions">
              {/* <Link to="/edit" className="negative">Cancel</Link>
              <Button circular color="green" size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="pencil" />Edit</Link>
            </div>
            <Form>
              <Form.Group>
                <Form.Field width={8}>
                  <Label>E-mail Address</Label>
                </Form.Field>
                <Form.Field width={8}>
                  <Input type="email" defaultValue="jamest.gains@gmail.com" readOnly />
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
          <div className="form-card card editable">
            <h3>Addresses</h3>
            <div className="actions">
              {/* <Link to="/edit" className="negative">Cancel</Link>
              <Button circular color="green" size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="pencil" />Edit</Link>
            </div>
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
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.street1} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Street 2</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.street2} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>City</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.city} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>State</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.state} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>ZIP code</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.zipCode} readOnly />
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
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.street1} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Street 2</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.street2} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>City</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.city} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>State</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.state} readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>ZIP code</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue={props.details.legalDetails.legalAddress.zipCode} readOnly />
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
          <div className="form-card card editable">
            <h3>Phone Numbers</h3>
            <div className="actions">
              {/* <Link to="/edit" className="negative">Cancel</Link>
              <Button circular color="green" size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="pencil" />Edit</Link>
            </div>
            <Form>
              <Form.Group>
                <Form.Field width={8}>
                  <Label>Phone number</Label>
                </Form.Field>
                <Form.Field width={8}>
                  <Input type="tel" defaultValue={props.details.contactDetails.phone.number} readOnly />
                </Form.Field>
              </Form.Group>
            </Form>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default userDetails;
