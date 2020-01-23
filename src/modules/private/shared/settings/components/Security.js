import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Link, withRouter } from 'react-router-dom';
import { Card, Header, Divider, Label, Button, Table } from 'semantic-ui-react';
import ChangePassword from '../../../../auth/containers/ChangePassword';
import NewPhoneNumber from './profileSettings/NewPhoneNumber';
import NewEmailAddress from './profileSettings/NewEmailAddress';
import ConfirmEmailAddress from '../../../../auth/containers/ConfirmEmailAddress';
import ConfirmPhoneNumber from './profileSettings/ConfirmPhoneNumber';
import Helper from '../../../../../helper/utility';
import { securitySections } from '../../../../../services/constants/user';
import ManageMultiFactorAuth from './profileSettings/ManageMultiFactorAuth';
import DeleteUser from './profileSettings/DeleteUser';

@inject('userDetailsStore', 'userStore')
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
          render={props => <ConfirmPhoneNumber newPhoneNumber refLink={this.props.match.url} {...props} />}
        />
        <Route exact path={`${match.url}/mfa`} render={() => <ManageMultiFactorAuth refLink={this.props.match.url} />} />
        <Route path={`${this.props.match.url}/new-email-address`} render={() => <NewEmailAddress refLink={this.props.match.url} />} />
        <Route
          path={`${this.props.match.url}/confirm-email-address`}
          render={props => <ConfirmEmailAddress refLink={this.props.match.url} {...props} />}
        />

        {!this.props.userStore.isInvestor
        && (
          <>
            <Header as="h4">Security</Header>
            <p>
              Manage your security settings and contact information.
              It&apos;s important to update your password regularly and utilize the security features
              that apply to you.
            </p>
          </>
        )
        }
          <Card fluid>
            <Card.Content className="very padded">
              {securitySections.map(section => (
              <>
                <Header as="h4">{section.title}</Header>
                <p>{section.action[0] === 'mfa' ? (getUserMfaMode ? section.description : section.descriptionNotAvailable) : section.description}</p>
                <Divider hidden />
                <Card.Description className="mb-40">
                  {(section.action[0] === 'mfa' && getUserMfaMode) ? (
                    <Table compact="very" basic="very" className="no-border mb-20">
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell collapsing><b>Email</b> {getUserMfaMode && getUserMfaMode === 'EMAIL' && <Label color="green" size="mini">Selected</Label> }</Table.Cell>
                          <Table.Cell collapsing>
                            {userDetails.email && userDetails.email.address}
                          </Table.Cell>
                          <Table.Cell><Link className="link" to="/dashboard/account-settings/security/new-email-address">Update</Link></Table.Cell>
                        </Table.Row>
                        <Table.Row>
                          <Table.Cell collapsing><b>Phone</b> {getUserMfaMode && getUserMfaMode !== 'EMAIL' && <Label color="green" size="mini">Selected</Label> }</Table.Cell>
                          <Table.Cell collapsing>{userDetails.phone && userDetails.phone.number ? Helper.phoneNumberFormatter(userDetails.phone.number) : '--'}</Table.Cell>
                          <Table.Cell><Link className="link" to="/dashboard/account-settings/security/new-phone-number">Update</Link></Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
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
                        to={section.action[0] === 'mfa' && !userDetails.phone ? '/dashboard/account-settings/security/new-phone-number' : `${match.url}/${section.action[0]}`}
                        inverted
                        color="green"
                        content={section.action[1]}
                      />
                  )
                  }
                </Card.Description>
                <Divider section />
              </>
              ))
            }
            {this.props.userStore.isInvestor
            && (
              <DeleteUser />
            )}
          </Card.Content>
        </Card>
      </div>
    );
  }
}
