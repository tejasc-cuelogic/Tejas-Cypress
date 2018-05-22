import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Card, Grid, Header, Button, Divider } from 'semantic-ui-react';
import ChangePassword from './ChangePassword';

export default class Security extends Component {
  render() {
    return (
      <div>
        <Route exact path={`${this.props.match.url}/change-password`} component={ChangePassword} />
        <Header as="h3">Security</Header>
        <p className="intro-text">
          Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris<br />
          nec malesuada fames ac turpisPellentesque facilisis. Nulla imperdiet sit amet magna.
        </p>
        <Grid>
          <Grid.Column widescreen={7} largeScreen={8} computer={8} tablet={16} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Password</Header>
                <p>
                  Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente
                  sque dui, non felis. Maecenas malesuada elit lectus felis, malseoads
                </p>
                <Divider hidden />
                <Card.Description>
                  <Button as={Link} to={`${this.props.match.url}/change-password`} inverted color="green" content="Change password" />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column widescreen={7} largeScreen={8} computer={8} tablet={16} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Multi-factor autentitaction</Header>
                <p>
                  Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente
                  sque dui, non felis. Maecenas malesuada elit lectus felis, malseoads
                </p>
                <Divider hidden />
                <Card.Description>
                  <Button inverted color="green" content="Manage multi-factor autentication" />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column widescreen={7} largeScreen={8} computer={8} tablet={16} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Challenge Questions</Header>
                <p>
                  Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente
                  sque dui, non felis. Maecenas malesuada elit lectus felis, malseoads
                </p>
                <Divider hidden />
                <Card.Description>
                  <Button inverted color="green" content="Manage challenge questions" />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column widescreen={7} largeScreen={8} computer={8} tablet={16} mobile={16}>
            <Card fluid>
              <Card.Content>
                <Header as="h3">Social connect</Header>
                <p>
                  Your NextSeed account is not connected to any social media.<br />
                  If you wish to connect it now, click one of the button below.
                </p>
                <Divider hidden />
                <Card.Description>
                  <Button.Group>
                    <Button color="facebook" icon={{ className: 'ns-facebook' }} content="Connect with Faceook" />
                    <Button color="google plus" icon="google plus" content="Connect with Google" />
                  </Button.Group>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
