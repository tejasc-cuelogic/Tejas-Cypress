import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { Header, Button, Item, List } from 'semantic-ui-react';
import accountActions from '../../../../actions/account';
import LinkBankForm from './LinkBankForm';
import { FormInput } from '../../../../components/form/FormElements';

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
        <div className="row">
          <FormInput
            name="bankName"
            fielddata={formBankSearch.fields.bankName}
            changed={bankSearchChange}
            onBlur={accountActions.bankSearch}
          />
          <div className="">
            {
              <List celled vertical inverted>
                {
                  _.map(bankListing, bankData => (
                    <Link
                      key={bankData.institution_id}
                      as="a"
                      to="/app/dashboard"
                      onClick={() => accountActions.bankSelect(bankData.institution_id)}
                    >
                      {bankData.logo !== null && <Item.Image size="mini" src={`data:image/png;base64, ${bankData.logo}`} />}
                      <span>{bankData.name}</span>
                    </Link>
                  ))
                }
              </List>
            }
          </div>
        </div>
        <div className="center-align">
          <Button className="theme-link" primary onClick={() => this.props.individualAccountStore.setBankLinkInterface('form')}>or enter it manually</Button>
        </div>
      </div>
    );
  }
}
