import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { startCase } from 'lodash';
import { Grid, Card, Statistic, Popup, Icon, Button, Divider, Header } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { EmptyDataSet, InlineLoader } from '../../../../../../theme/shared';
import { ACCREDITATION_STATUS_LABEL } from './../../../../../../services/constants/investmentLimit';

@inject('investmentLimitStore', 'uiStore', 'userDetailsStore', 'accreditationStore')
@withRouter
@observer
export default class FinancialInfo extends Component {
  componentWillMount() {
    this.props.investmentLimitStore.getInvestedAmount();
    this.props.investmentLimitStore.setAccountsLimits();
    this.props.accreditationStore.getUserAccreditation().then(() => {
      this.props.accreditationStore.initiateAccreditation();
    });
  }
  // eslint-disable-next-line react/sort-comp
  submit = (e) => {
    e.preventDefault();
    this.props.investmentLimitStore.updateFinInfo();
  }
  handleUpdateInvestmentLimit =(e, accountType, accountId) => {
    e.preventDefault();
    this.props.investmentLimitStore.setInvestmentLimitInfo(accountType, accountId);
    this.props.history.push(`${this.props.match.url}/update`);
  }
  handleVerifyAccreditation = (e, accountType, accountId) => {
    e.preventDefault();
    if (accountType === 'entity') {
      if (this.props.userDetailsStore.isEntityTrust) {
        this.props.history.push(`${this.props.match.url}/verify-trust-entity-accreditation/${accountId}/${accountType}`);
      } else {
        this.props.history.push(`${this.props.match.url}/verify-entity-accreditation/${accountId}/${accountType}`);
      }
    } else {
      this.props.history.push(`${this.props.match.url}/verify-accreditation/${accountId}/${accountType}`);
    }
  }
  getStatus = (accName) => {
    let status = '';
    status = accName ? (accName.status === 'REQUESTED' && accName.expiration && (DataFormatter.diffDays(DataFormatter.formatedDate(accName.expiration), false, true) < 0)) ? 'Expired' : (accName.status && ACCREDITATION_STATUS_LABEL[accName.status]) : '-';
    return status;
  }
  getDate = (accName) => {
    let date = '';
    date = accName && accName.status === 'REQUESTED' && accName.requestDate ? DataFormatter.formatedDate(accName.requestDate) : accName && (accName.status === 'APPROVED' || accName.status === 'DECLINED') && accName.reviewed && accName.reviewed.date ? DataFormatter.formatedDate(accName.reviewed.date) : '-';
    return date;
  }
  render() {
    const {
      getActiveAccountList, entityCurrentLimit, individualIRACurrentLimit,
    } = this.props.investmentLimitStore;
    const { accreditationData } = this.props.accreditationStore;
    const { currentUser } = this.props.userDetailsStore;
    if (currentUser.loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        {getActiveAccountList && getActiveAccountList.accountList.length ?
        getActiveAccountList.accountList.map(account => (
          <Grid.Row>
            <Grid.Column widescreen={12} largeScreen={16} computer={16} tablet={16} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Card.Header className="with-icon">
                    {
                    account.name === 'ira' && getActiveAccountList.isIndAccExist ?
                      <Aux>
                        <Icon color="teal" className="ns-individual-line" /> Individual
                        <Icon color="teal" className={`ns-${account.name}-line`} /> {account.name.toUpperCase()}
                      </Aux> :
                      <Aux>
                        <Icon color="teal" className={`ns-${account.name}-line`} /> {account.name === 'ira' ? account.name.toUpperCase() : startCase(account.name)}
                      </Aux>
                    }
                  </Card.Header>
                </Card.Content>
                <Divider horizontal className="only-border" />
                <Grid celled="internally" padded="horizontally" stackable>
                  <Grid.Row>
                    <Grid.Column width={8}>
                      <Card.Content>
                        <Header as="h4">Regulation Crowdfunding Limits</Header>
                        <p className="intro-text">
                          {account.name === 'ira' ? `The total amount you can invest in Regulation
                            Crowdfunding offerings within a 12-month period depends on your income
                            and net worth.` : `The total amount you can invest in Regulation
                            Crowdfunding offerings within a 12-month period depends on the
                            entity's annual revenue and net assets.`
                          }
                          <Link target="_blank" to="/app/resources/faq">
                            &nbsp;See FAQ on investment limits
                          </Link>
                        </p>
                        <Statistic size="tiny">
                          <Statistic.Label>
                            Your current investment limit
                            <Popup
                              trigger={<Icon className="ns-help-circle" />}
                              content="Your current investment limit as of today"
                              position="top center"
                              className="left-align"
                            />
                          </Statistic.Label>
                          <Statistic.Value>
                            {Helper.MoneyMathDisplayCurrency(account.name === 'entity' ? entityCurrentLimit : individualIRACurrentLimit)}
                          </Statistic.Value>
                        </Statistic>
                        <Divider clearing hidden />
                        <Button onClick={e => this.handleUpdateInvestmentLimit(e, account.name, account.details.accountId)} inverted color="green" content="Update investment limits" />
                      </Card.Content>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      {accreditationData[account.name] &&
                      accreditationData[account.name].status ?
                        <Card.Content>
                          <Header as="h4">
                            Accreditation
                            <Link as={Button} to="/" className="link" onClick={e => this.handleVerifyAccreditation(e, account.name, account.details.accountId)}><small>Update accreditation</small></Link>
                          </Header>
                          <dl className="dl-horizontal">
                            <dt>Status :</dt>
                            <b><dd className={`${this.getStatus(accreditationData[account.name]) === 'Requested' ? 'warning' : this.getStatus(accreditationData[account.name]) === 'Approved' ? 'positive' : 'negative'}-text`}>{this.getStatus(accreditationData[account.name])}</dd></b>
                            <dt>Date :</dt>
                            <dd>{this.getDate(accreditationData[account.name])}</dd>
                          </dl>
                        </Card.Content>
                        :
                        <Card.Content>
                          <Header as="h4">Reg D 506(c) Investor Accreditation</Header>
                          <p className="intro-text">In order to participate in Reg D offerings, the SEC requires NextSeed to verify your Accredited Investor status</p>
                          <Divider hidden />
                          <Card.Description>
                            <Button onClick={e => this.handleVerifyAccreditation(e, account.name, account.details.accountId)} primary content="Verify accreditation" />
                          </Card.Description>
                        </Card.Content>
                      }
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Card>
            </Grid.Column>
          </Grid.Row>
          )) : <EmptyDataSet title="No data available for investment limits." />
        }
      </Aux>
    );
  }
}
