import React from 'react';
import { Grid, Form, Input, Label } from 'semantic-ui-react';
import Spinner from '../../../theme/ui/Spinner';
import ToggleEdit from './ToggleEdit';

const userDetails = (props) => {
  if (!props.details || !props.details.id) {
    return (
      <div>
        <Spinner loaderMessage="Loading..." />
      </div>
    );
  }

  return (
    <div className="content-spacer">
      <div className={`overlay ${(props.editCard) ? 'editing' : ''}`} />
      <Grid columns={1} stackable>
        <Grid.Row>
          <Grid.Column>
            <div className={`form-card card editable ${(props.editCard === 1) ? 'editing' : ''}`}>
              <ToggleEdit card={1} title="Names" setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
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
                            <Input type="text" value={props.details.legalDetails.legalName.firstLegalName} readOnly />
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
              <ToggleEdit card={2} title="DOB & SSN" setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
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
              <ToggleEdit card={3} title="Email & Password" setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
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
              <ToggleEdit card={4} title="Addresses" setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
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
            <div className={`form-card card editable ${(props.editCard === 5) ? 'editing' : ''}`}>
              <ToggleEdit card={5} title="Phone Numbers" setEditCard={props.setEditCard} save={props.save} editCard={props.editCard} />
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
};

export default userDetails;
