import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Button, Image, Grid, Form, Input, Message } from 'semantic-ui-react';
import { bankAccountActions } from '../../../../../services/actions';
import ManualForm from './ManualForm';
import { IND_BANK_LIST } from '../../../../../constants/account';
import { ListErrors } from '../../../../../theme/shared';
import LinkbankSummary from './LinkbankSummary';
import NSImage from '../../../../shared/NSImage';

const isMobile = document.documentElement.clientWidth < 768;

@inject('bankAccountStore', 'uiStore', 'identityStore', 'accountStore')
@withRouter
@observer
export default class Plaid extends Component {
  constructor(props) {
    super(props);
    this.props.bankAccountStore.setPlaidBankVerificationStatus(false);
    this.props.bankAccountStore.setShouldValidateAmount();
    this.setBankSummary();
    this.props.uiStore.clearErrors();
  }

  componentDidUpdate() {
    this.props.bankAccountStore.resetPlaidBankSearch();
  }

  componentWillUnmount() {
    this.props.bankAccountStore.resetPlaidBankSearch(true);
    const modalEle = document.getElementById('multistep-modal');
    if (modalEle && isMobile) {
      modalEle.parentNode.scrollTo(0, 0);
    }
  }


  setBankSummary = () => {
    const {
      isAccountPresent,
      showAddFunds,
      manualLinkBankSubmitted,
    } = this.props.bankAccountStore;
    if (isAccountPresent
      && !showAddFunds
      && !manualLinkBankSubmitted
      && this.props.action !== 'change') {
      this.props.bankAccountStore.setLinkBankSummary();
    }
  }

  handleBankSelect = async (referenceLink) => {
    const res = await this.props.identityStore.sendOtp('BANK_CHANGE', isMobile);
    if (res) {
      const confirmUrl = `${referenceLink}/confirm`;
      this.props.history.push(confirmUrl);
    }
  }

  handleInstitutionClick = (insId, action) => {
    this.props.bankAccountStore.setFieldValue('bankSelect', true);
    bankAccountActions.bankSelect(insId, action);
  }

  render() {
    const {
      bankLinkInterface,
      formBankSearch,
      bankSearchChange,
      bankListing,
      isPlaidBankVerified,
      linkbankSummary,
      isAccountPresent,
    } = this.props.bankAccountStore;
    const { errors } = this.props.uiStore;
    const { action, refLink } = this.props;
    const headerText = 'Next, link your bank account';
    const subHeaderText = action && action === 'change'
      ? 'Select your bank from the list'
      : `In order to make your first investment,
      please add funds from an account below.`;
    if (isPlaidBankVerified) {
      this.handleBankSelect(refLink);
      this.props.bankAccountStore.setPlaidBankVerificationStatus(false);
    }

    if (action !== 'change' && linkbankSummary) {
      return <LinkbankSummary />;
    }
    if (bankLinkInterface === 'form') {
      return <ManualForm action={action} refLink={refLink} />;
    }
    return (
      <>
        <>
          <Header as="h4">{headerText}</Header>
          <p className="mb-20">{subHeaderText}</p>
          <Form>
            <Input
              fluid
              placeholder="Search"
              name="bankName"
              icon={{ className: 'ns-search' }}
              iconPosition="left"
              value={formBankSearch.fields.bankName.value}
              onChange={bankSearchChange}
              onKeyPress={bankAccountActions.bankSearch}
              className="search-field"
            />
          </Form>
          <div className="bank-list">
            {typeof bankListing !== 'undefined' && bankListing.length === 0
              && (
                <Grid column={1}>
                  <Grid.Column>No results found.</Grid.Column>
                </Grid>
              )
            }
            {
              <Grid>
                {typeof bankListing !== 'undefined'
                  && bankListing.map(bankData => (
                    <Grid.Column key={bankData.institution_id} computer={5} tablet={5} mobile={8} className={isMobile ? 'pb-half pt-half' : ''}>
                      <Link
                        as="a"
                        className="bank-link"
                        to={this.props.match.url}
                        onClick={() => this.handleInstitutionClick(
                          bankData.institution_id,
                          action,
                        )
                        }
                      >
                        <span>
                          {bankData.logo !== null && <Image size="mini" src={`data:image/png;base64, ${bankData.logo}`} />}
                          {bankData.logo === null && <NSImage size="mini" path="banks/default.png" />}
                          <span>{bankData.name}</span>
                        </span>
                      </Link>
                    </Grid.Column>
                  ))
                }
                {typeof bankListing === 'undefined'
                  && IND_BANK_LIST.map(bankData => (
                    <Grid.Column key={bankData.institutionID} computer={5} tablet={5} mobile={8} className={isMobile ? 'pb-half pt-half' : ''}>
                      <Link
                        as="a"
                        className="bank-link"
                        to={this.props.match.url}
                        onClick={
                          () => this.handleInstitutionClick(bankData.institutionID, action)
                        }
                      >
                        {/* eslint-disable import/no-dynamic-require */}
                        {/* eslint-disable global-require */}
                        <NSImage path={`banks/${bankData.institutionID}.png`} />
                      </Link>
                    </Grid.Column>
                  ))
                }
              </Grid>
            }
          </div>
          {errors
            && (
              <Message error>
                <ListErrors errors={[errors.message]} />
              </Message>
            )
          }
          <div className={`${isMobile && 'center-align'} mt-30`}>
            <Button color="green" className="link-button" data-cy="link-bank-manually" content="Link bank account manually" onClick={() => this.props.bankAccountStore.setBankLinkInterface('form')} />
          </div>
        </>
        {(isAccountPresent && action !== 'change') && (
          <div className={`${isMobile && 'center-align'} mt-30`}>
               <Button color="green" className="link-button" content="Keep existing linked bank" onClick={() => this.props.bankAccountStore.setLinkBankSummary()} />
          </div>
        )}
      </>
    );
  }
}
