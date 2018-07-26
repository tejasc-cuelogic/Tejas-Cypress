import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Link } from 'react-router-dom';
import { Card, Grid, Header, Button, Divider, Label } from 'semantic-ui-react';
import ChangePassword from '../../../../auth/containers/ChangePassword';
import { securitySections } from './../../../../../services/constants/user';
import ManageMultiFactorAuth from '../components/profileSettings/ManageMultiFactorAuth';

@inject('userDetailsStore')
@observer
export default class Security extends Component {
  render() {
    const { userDetails } = this.props.userDetailsStore;
    const { match } = this.props;
    const activeMfa = 0;
    const isMfaAvailalbe = 1;
    return (
      <div>
        <Route exact path={`${this.props.match.url}/change-password`} component={ChangePassword} />
        <Route exact path={`${this.props.match.url}/mfa`} component={ManageMultiFactorAuth} />
        <Header as="h4">Security</Header>
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
                    <Header as="h4">{section.title}</Header>
                    <p>{section.action[0] === 'mfa' ? (isMfaAvailalbe ? section.description : section.descriptionNotAvailable) : section.description}</p>
                    <Divider hidden />
                    <Card.Description>
                      {(section.action[0] === 'mfa' && isMfaAvailalbe) ? (
                        <dl className="dl-horizontal">
                          <dt>E-mail {activeMfa === 1 && <Label color="green" size="mini">Active MFA</Label> }</dt>
                          <dd>{userDetails.email} <Link className="link pull-right" to="/app/profile-settings/profile-data/new-email-address">Update Email</Link></dd>
                          <dt>Phone {activeMfa === 0 && <Label color="green" size="mini">Active MFA</Label> }</dt>
                          <dd>{userDetails.contactDetails && userDetails.contactDetails.phone ? userDetails.contactDetails.phone.number : '--'} <Link className="link pull-right" to="/app/profile-settings/profile-data/new-phone-number">Update Phone</Link></dd>
                        </dl>
                      ) : null}
                      {section.action[0] === 'social-connect' ? (
                        <Button.Group>
                          <Button color="facebook" icon={{ className: 'ns-facebook' }} content="Connect with Faceook" />
                          <Button color="google plus" icon="google plus" content="Connect with Google" />
                        </Button.Group>
                      ) : (
                        <Button disabled={(section.action[0] === 'mfa' && !isMfaAvailalbe)} as={Link} to={`${match.url}/${section.action[0]}`} inverted color="green" content={section.action[1]} />
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
