import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';
import { Header, Button, Image, Grid, Form, Loader, Input, Dimmer } from 'semantic-ui-react';
import accountActions from '../../../../actions/account';
import LinkBankForm from './LinkBankForm';
import defaultBankLogo from '../../../../assets/images/banks/default.png';
import { IND_BANK_LIST } from '../../../../constants/account';

@inject('individualAccountStore', 'uiStore')
@withRouter
@observer
export default class LinkBankPlaid extends Component {
  componentWillUnmount() {
    this.props.individualAccountStore.setBankLinkInterface('list');
  }

  render() {
    const {
      bankLinkInterface,
      formBankSearch,
      bankSearchChange,
      bankListing,
    } = this.props.individualAccountStore;
    const { inProgress } = this.props.uiStore;
    if (bankLinkInterface === 'form') {
      return <LinkBankForm />;
    }
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Select your bank from the list</Header>
        <Form>
          <Input
            fluid
            placeholder="Search"
            name="bankName"
            icon={{ className: 'ns-search' }}
            iconPosition="left"
            value={formBankSearch.fields.bankName.value}
            onChange={bankSearchChange}
            onKeyUp={accountActions.bankSearch}
          />
        </Form>
        <div className="bank-list">
          <Dimmer active={inProgress}>
            <Loader active={inProgress} />
          </Dimmer>
          {
            <Grid columns={3}>
              {
                _.map(bankListing, bankData => (
                  <Grid.Column key={bankData.institution_id}>
                    <Link
                      as="a"
                      className="bank-link"
                      to={this.props.match.url}
                      onClick={() => accountActions.bankSelect(bankData.institution_id)}
                    >
                      <span>
                        {bankData.logo !== null && <Image centered size="mini" src={`data:image/png;base64, ${bankData.logo}`} />}
                        {bankData.logo === null && <Image centered size="mini" src={defaultBankLogo} />}
                        <span>{bankData.name}</span>
                      </span>
                    </Link>
                  </Grid.Column>
                ))
              }
              {typeof bankListing === 'undefined' &&
                _.map(IND_BANK_LIST, bankData => (
                  <Grid.Column key={bankData.institutionID}>
                    <Link
                      as="a"
                      className="bank-link"
                      to={this.props.match.url}
                      onClick={() => accountActions.bankSelect(bankData.institutionID)}
                    >
                      {/* eslint-disable import/no-dynamic-require */}
                      {/* eslint-disable global-require */}
                      <Image centered size="large" src={require(`../../../../assets/images/banks/${bankData.institutionID}.png`)} />
                    </Link>
                  </Grid.Column>
                ))
              }
            </Grid>
          }
        </div>
        <div className="center-align">
          <Button className="theme-link" primary onClick={() => this.props.individualAccountStore.setBankLinkInterface('form')}>or enter it manually</Button>
        </div>
      </div>
    );
  }
}
