import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Card, Grid, Header, Button, Divider, Label } from 'semantic-ui-react';
import ChangePassword from '../../../../auth/containers/ChangePassword';
import { securitySections } from './../../../../../services/constants/user';
import MfaModal from '../components/profileSettings/MfaModal';

export default class Security extends Component {
  render() {
    const { match } = this.props;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/change-password`} component={ChangePassword} />
        <Route exact path={`${this.props.match.url}/mfa`} component={MfaModal} />
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
          <Grid.Column
            widescreen={7}
            largeScreen={8}
            computer={8}
            tablet={16}
            mobile={16}
          >
            <Card fluid>
              <Card.Content>
                <Header as="h3">Multi-factor autentitaction</Header>
                <p>You can choose your Active MFA Factor.</p>
                <Divider hidden />
                <dl className="dl-horizontal">
                  <dt>Email</dt>
                  <dd>sandy@gmail.com <Link className="link" to="/">Update Email</Link></dd>
                  <dt>Phone <Label color="green" size="mini">Active MFA</Label></dt>
                  <dd>321-325-6564 <Link className="link" to="/">Update Phone</Link></dd>
                </dl>
                <Card.Description>
                  <Button inverted color="green" content="Change your active MFA factor" />
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
