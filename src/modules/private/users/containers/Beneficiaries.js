import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Card, Grid, Header, Button, Divider } from 'semantic-ui-react';
import AddBeneficiaries from './AddBeneficiaries';

export default class Beneficiaries extends Component {
  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/add-beneficiaries`} component={AddBeneficiaries} />
        <Header as="h3">Beneficiaries</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis</p>
        <Grid columns={1} stackable>
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={8} computer={10} tablet={13} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Header as="h3">You have no beneficiaries yet</Header>
                  <p>Add your first beneficiary and lorem ipsum dolor sit amet lorem ipsum dolor</p>
                  <Divider hidden />
                  <Card.Description>
                    <Button as={Link} to={`${this.props.match.url}/add-beneficiaries`} primary content="Add new beneficiary" />
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column widescreen={8} largeScreen={8} computer={10} tablet={13} mobile={16}>
              <Card fluid>
                <Grid divided padded="horizontally">
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Card.Content>
                        <dl className="dl-horizontal">
                          <dt>Names</dt>
                          <dd>Jane Smith</dd>
                          <dt>DOB</dt>
                          <dd>12-02-1961</dd>
                          <dt>Relationship</dt>
                          <dd>Wife</dd>
                        </dl>
                      </Card.Content>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Card.Content>
                        <dl className="dl-horizontal">
                          <dt>Legal Address</dt>
                          <dd>Baker Street 221B<br />
                            New York, NY, 1001
                          </dd>
                        </dl>
                      </Card.Content>
                      <Card.Content>
                        <Header as="h6" color="orange">Pending Approval</Header>
                      </Card.Content>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card>
              <Card fluid>
                <Grid divided padded="horizontally">
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Card.Content>
                        <dl className="dl-horizontal">
                          <dt>Names</dt>
                          <dd>Rachel Smith</dd>
                          <dt>DOB</dt>
                          <dd>03-02-1997</dd>
                          <dt>Relationship</dt>
                          <dd>Daughter</dd>
                        </dl>
                      </Card.Content>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Card.Content>
                        <dl className="dl-horizontal">
                          <dt>Legal Address</dt>
                          <dd>Baker Street 221B<br />
                            New York, NY, 1001
                          </dd>
                        </dl>
                      </Card.Content>
                      <Card.Content>
                        <Button size="mini" color="red" className="ghost-button">Remove Beneficiary</Button>
                      </Card.Content>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card>
              <Button color="green" className="relaxed">Add new beneficiary</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
