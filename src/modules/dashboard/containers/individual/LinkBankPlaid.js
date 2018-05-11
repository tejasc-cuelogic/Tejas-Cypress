import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Header, Button, Image, Grid } from 'semantic-ui-react';
import accountActions from '../../../../actions/account';
import LinkBankForm from './LinkBankForm';
import { FormInput } from '../../../../components/form/FormElements';
import defaultBankLogo from '../../../../assets/images/banks/default.png';
import { IND_BANK_LIST } from '../../../../constants/account';
import ImageLoader from '../../../../components/common/ImageLoader';

@inject('individualAccountStore')
@observer
export default class LinkBankPlaid extends Component {
  render() {
    const {
      bankLinkInterface,
      formBankSearch,
      bankSearchChange,
      bankListing,
    } = this.props.individualAccountStore;
    if (bankLinkInterface === 'form') {
      return <LinkBankForm />;
    }
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Select your bank from the list</Header>
        <FormInput
          name="bankName"
          fielddata={formBankSearch.fields.bankName}
          changed={bankSearchChange}
          onBlur={accountActions.bankSearch}
        />
        <div className="bank-list">
          {
            <Grid columns={3}>
              {
                _.map(bankListing, bankData => (
                  <Grid.Column>
                    <Link
                      key={bankData.institution_id}
                      as="a"
                      className="bank-link"
                      to="/app/dashboard"
                      onClick={() => accountActions.bankSelect(bankData.institution_id)}
                    >
                      {bankData.logo !== null && <Image centered size="mini" src={`data:image/png;base64, ${bankData.logo}`} />}
                      {bankData.logo === null && <Image centered size="mini" src={defaultBankLogo} />}
                      <span>{bankData.name}</span>
                    </Link>
                  </Grid.Column>
                ))
              }
              {bankListing.length === 0 &&
                _.map(IND_BANK_LIST, bankData => (
                  <Grid.Column>
                    <Link
                      key={bankData.institutionID}
                      as="a"
                      className="bank-link"
                      to="/app/dashboard"
                      onClick={() => accountActions.bankSelect(bankData.institutionID)}
                    >
                      {/* eslint-disable global-require */}
                      <ImageLoader imagePath={`banks/${bankData.institutionID}.png`} />
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
