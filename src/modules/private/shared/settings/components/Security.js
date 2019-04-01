import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Link, withRouter } from 'react-router-dom';
import { Card, Grid, Header, Divider, Label, Button } from 'semantic-ui-react';
import ChangePassword from '../../../../auth/containers/ChangePassword';
import NewPhoneNumber from './profileSettings/NewPhoneNumber';
import NewEmailAddress from './profileSettings/NewEmailAddress';
import ConfirmEmailAddress from '../../../../../modules/auth/containers/ConfirmEmailAddress';
import ConfirmPhoneNumber from './/profileSettings/ConfirmPhoneNumber';
import Helper from '../../../../../helper/utility';
import { securitySections } from './../../../../../services/constants/user';
import ManageMultiFactorAuth from '../components/profileSettings/ManageMultiFactorAuth';

@inject('userDetailsStore')
@withRouter
@observer
export default class Security extends Component {
  render() {
    const { userDetails, getUserMfaMode } = this.props.userDetailsStore;
    const { match } = this.props;
    return (
      <div>
        <Route path={`${match.url}/new-phone-number`} render={() => <NewPhoneNumber refLink={this.props.match.url} />} />
        <Route exact path={`${match.url}/change-password`} render={props => <ChangePassword refModule="security" {...props} />} />
        <Route
          path={`${this.props.match.url}/confirm`}
          render={props =>
            <ConfirmPhoneNumber newPhoneNumber refLink={this.props.match.url} {...props} />}
        />
        <Route exact path={`${match.url}/mfa`} render={() => <ManageMultiFactorAuth refLink={this.props.match.url} />} />
        <Route path={`${this.props.match.url}/new-email-address`} render={() => <NewEmailAddress refLink={this.props.match.url} />} />
        <Route
          path={`${this.props.match.url}/confirm-email-address`}
          render={props => <ConfirmEmailAddress refLink={this.props.match.url} {...props} />}
        />
        <Header as="h4">Security</Header>
        <p className="intro-text">
          Manage your security settings and contact information.<br />
          Its important to update your password regularly and utilize the security features
          that apply to you.
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
                    <p>{section.action[0] === 'mfa' ? (getUserMfaMode ? section.description : section.descriptionNotAvailable) : section.description}</p>
                    <Divider hidden />
                    <Card.Description>
                      {(section.action[0] === 'mfa' && getUserMfaMode) ? (
                        <dl className="dl-horizontal">
                          <dt>E-mail {getUserMfaMode && getUserMfaMode === 'EMAIL' && <Label color="green" size="mini">Active MFA</Label> }</dt>
                          <dd>{userDetails.email && userDetails.email.address} <Link className="link pull-right" to="/app/profile-settings/security/new-email-address">Update Email</Link></dd>
                          <dt>Phone {getUserMfaMode && getUserMfaMode !== 'EMAIL' && <Label color="green" size="mini">Active MFA</Label> }</dt>
                          <dd>{userDetails.phone && userDetails.phone.number ? Helper.phoneNumberFormatter(userDetails.phone.number) : '--'} <Link className="link pull-right" to="/app/profile-settings/security/new-phone-number">Update Phone</Link></dd>
                        </dl>
                      ) : null}
                      {section.action[0] === 'social-connect' ? (
                        <Button.Group>
                          <Button
                            color="facebook"
                            icon={{ className: 'ns-facebook' }}
                            content="Connect with Faceook"
                          />
                          <Button
                            color="google plus"
                            icon="google plus"
                            content="Connect with Google"
                          />
                        </Button.Group>
                      ) : (
                        <Button
                          disabled={(section.action[0] === 'mfa' && !getUserMfaMode)}
                          as={Link}
                          to={userDetails.phone ? `${match.url}/${section.action[0]}` : '/app/profile-settings/security/new-phone-number'}
                          inverted
                          color="green"
                          content={section.action[1]}
                        />
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
