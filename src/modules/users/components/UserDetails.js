import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Form, Input, Label, Button } from 'semantic-ui-react';

const userDetails = () => (
  <div className="content-spacer">
    <div className="overlay editing" />
    <Grid columns={1} stackable>
      <Grid.Row>
        <Grid.Column>
          <div className="form-card card editable">
            <h3>Names</h3>
            <div className="actions">
              {/* <Link to="/edit" className="negative">Cancel</Link>
              <Button primary size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="ns-pencil" />Edit</Link>
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
                          <Input type="text" defaultValue="James" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Middle Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="Thomas" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Last Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="Gainsborough" readOnly />
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
                          <Input type="text" defaultValue="James" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Middle Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="Thomas" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Last Name</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="Gainsborough" readOnly />
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
          <div className="form-card card editable editing">
            <h3>DOB & SSN</h3>
            <div className="actions">
              <Link to="/edit" className="negative">Cancel</Link>
              <Button primary size="mini" to="/app/users/new"><Icon name="check" />Save</Button>
              {/* <Link to="/edit"><Icon name="ns-pencil" />Edit</Link> */}
            </div>
            <Form>
              <Form.Group>
                <Form.Field width={8}>
                  <Label>Date of Birth</Label>
                </Form.Field>
                <Form.Field width={8}>
                  <Input type="text" defaultValue="01-02-1989" readOnly />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field width={8}>
                  <Label>SSN number</Label>
                </Form.Field>
                <Form.Field width={8}>
                  <Input type="text" defaultValue="XXX-XX-XXX" readOnly />
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
              <Button primary size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="ns-pencil" />Edit</Link>
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
              <Button primary size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="ns-pencil" />Edit</Link>
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
                          <Input type="text" defaultValue="Baker Street" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Street 2</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="221B" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>City</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="New York" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>State</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="NY" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>ZIP code</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="1001" readOnly />
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
                          <Input type="text" defaultValue="Baker Street" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>Street 2</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="221B" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>City</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="New York" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>State</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="NY" readOnly />
                        </Form.Field>
                      </Form.Group>
                      <Form.Group>
                        <Form.Field width={8}>
                          <Label>ZIP code</Label>
                        </Form.Field>
                        <Form.Field width={8}>
                          <Input type="text" defaultValue="1001" readOnly />
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
              <Button primary size="mini"
              to="/app/users/new"><Icon name="check" />Save</Button> */}
              <Link to="/edit"><Icon name="ns-pencil" />Edit</Link>
            </div>
            <Form>
              <Form.Group>
                <Form.Field width={8}>
                  <Label>Phone number 1</Label>
                </Form.Field>
                <Form.Field width={8}>
                  <Input type="tel" defaultValue="202-555-0170" readOnly />
                </Form.Field>
              </Form.Group>
              <Form.Group>
                <Form.Field width={8}>
                  <Label>Phone number 2</Label>
                </Form.Field>
                <Form.Field width={8}>
                  <Input type="tel" defaultValue="202-555-0173" readOnly />
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
