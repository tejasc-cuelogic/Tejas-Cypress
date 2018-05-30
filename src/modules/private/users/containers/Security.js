import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Card, Grid, Header, Button, Divider } from 'semantic-ui-react';
import ChangePassword from '../components/profileSettings/ChangePassword';
import { securitySections } from '../constants/metadata';

export default class Security extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/change-password`} component={ChangePassword} />
        <Header as="h3">Security</Header>
        <p className="intro-text">
          Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris<br />
          nec malesuada fames ac turpisPellentesque facilisis. Nulla imperdiet sit amet magna.
        </p>
        <Grid>
          {
            securitySections.map(section => (
              <Grid.Column
                key={section.action[0]}
                widescreen={7}
                largeScreen={8}
                computer={8}
                tablet={16}
                mobile={16}
              >
                <Card fluid>
                  <Card.Content>
                    <Header as="h3">{section.title}</Header>
                    <p>{section.description}</p>
                    <Divider hidden />
                    <Card.Description>
                      {section.action[0] === 'social-connect' ? (
                        <Button.Group>
                          <Button color="facebook" icon={{ className: 'ns-facebook' }} content="Connect with Faceook" />
                          <Button color="google plus" icon="google plus" content="Connect with Google" />
                        </Button.Group>
                      ) : (
                        <Button as={Link} to={`${match.url}/${section.action[0]}`} inverted color="green" content={section.action[1]} />
                      )
                      }
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))
          }
        </Grid>
      </div>
    );
  }
}
