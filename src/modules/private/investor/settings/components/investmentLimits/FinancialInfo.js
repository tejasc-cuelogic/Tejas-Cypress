import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { startCase, get } from 'lodash';
import { Grid, Card, Statistic, Icon, Button, Divider, Header } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { DataFormatter } from '../../../../../../helper';
import { EmptyDataSet, InlineLoader, PopUpModal } from '../../../../../../theme/shared';
import { ACCREDITATION_STATUS_LABEL } from '../../../../../../services/constants/investmentLimit';

const isMobile = document.documentElement.clientWidth < 768;
@inject('investmentLimitStore', 'uiStore', 'userDetailsStore', 'accreditationStore')
@withRouter
@observer
export default class FinancialInfo extends Component {
  constructor(props) {
    super(props);
    if (this.props.match.isExact) {
      this.props.investmentLimitStore.getInvestedAmount();
      this.props.investmentLimitStore.setAccountsLimits();
      this.props.accreditationStore.getUserAccreditation().then(() => {
        this.props.accreditationStore.initiateAccreditation();
      });
    }
  }

  // eslint-disable-next-line react/sort-comp
  submit = (e) => {
    e.preventDefault();
    this.props.investmentLimitStore.updateFinInfo();
  }

  handleUpdateInvestmentLimit = (e, accountType, accountId) => {
    e.preventDefault();
    this.props.investmentLimitStore.setInvestmentLimitInfo(accountType, accountId);
    this.props.history.push(`${this.props.match.url}/update`);
  }

  handleVerifyAccreditation = (e, accountType) => {
    e.preventDefault();
    if (this.props.userDetailsStore.isEntityTrust && accountType === 'entity') {
      this.props.history.push(`${this.props.match.url}/verify-trust-entity-accreditation/${accountType}`);
    } else {
      this.props.history.push(`${this.props.match.url}/verify-accreditation/${accountType}`);
    }
  }

  getStatus = (accName) => {
    let status = '';
    status = accName ? (accName.status === 'CONFIRMED' && accName.expiration && (DataFormatter.diffDays(DataFormatter.formatedDate(accName.expiration), false, true) < 0)) ? 'Expired' : (accName.status && ACCREDITATION_STATUS_LABEL[accName.status]) : '-';
    return status;
  }

  getDate = (accName) => {
    let date = '';
    date = accName && accName.status === 'REQUESTED' && accName.requestDate ? DataFormatter.getDateAsPerTimeZone(accName.requestDate, true, false, false, 'MM/DD/YY') : accName && ['CONFIRMED', 'EXPIRED'].includes(accName.status) && accName.expiration ? DataFormatter.getDateAsPerTimeZone(accName.expiration, true, false, false, 'MM/DD/YY') : accName && accName.status === 'INVALID' && accName.reviewed && accName.reviewed.date ? DataFormatter.getDateAsPerTimeZone(accName.reviewed.date, true, false, false, 'MM/DD/YY') : '-';
    return date;
  }

  render() {
    const {
      getActiveAccountList, entityCurrentLimit, individualIRACurrentLimit,
      getInvestorAmountInvestedLoading,
    } = this.props.investmentLimitStore;
    const { accreditationData, loading } = this.props.accreditationStore;
    const { currentUser } = this.props.userDetailsStore;
    if (currentUser.loading || getInvestorAmountInvestedLoading
      || loading) {
      return <InlineLoader />;
    }
    return (
      <Grid>
        {getActiveAccountList && getActiveAccountList.accountList.length
          ? getActiveAccountList.accountList.map(account => (
            <Grid.Row>
              <Grid.Column widescreen={12} largeScreen={16} computer={16} tablet={16} mobile={16}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header className="with-icon">
                      {
                        account.name === 'ira' && getActiveAccountList.isIndAccExist
                          ? (
                            <>
                              <Icon color="teal" className="ns-individual-line" /> Individual
                        <Icon color="teal" className={`ns-${account.name}-line`} /> {account.name.toUpperCase()}
                            </>
                          )
                          : (
                            <>
                              <Icon color="teal" className={`ns-${account.name}-line`} /> {account.name === 'ira' ? account.name.toUpperCase() : startCase(account.name)}
                            </>
                          )
                      }
                    </Card.Header>
                  </Card.Content>
                  <Divider horizontal className="only-border" />
                  <Grid celled="internally" padded="horizontally">
                    <Grid.Row>
                      <Grid.Column computer={8} tablet={8} mobile={16}>
                        <Card.Content>
                          <Header as="h5" className={isMobile ? 'plr-0' : ''}>Regulation Crowdfunding Limits</Header>
                          <p className="intro-text">
                            {account.name === 'entity' ? `The total amount you can invest in Regulation
                            Crowdfunding offerings within a 12-month period depends on the
                            entity's annual revenue and net assets. ` : `The total amount you can invest in Regulation
                            Crowdfunding offerings within a 12-month period depends on your income
                            and net worth. `
                            }
                            <Link target="_blank" to="/resources/education-center/investor/faq">See FAQ on investment limits</Link>
                          </p>
                          <Statistic size="tiny">
                            <Statistic.Label>
                              <PopUpModal
                                customTrigger={<span className="popup-label">Your current investment limit</span>}
                                content="Your current investment limit as of today"
                                position="top center"
                                showOnlyPopup={!isMobile}
                                className="left-align"
                              />
                            </Statistic.Label>
                            <Statistic.Value>
                              {account.name === 'entity'
                                ? typeof entityCurrentLimit === 'string'
                                  ? Helper.MoneyMathDisplayCurrency(entityCurrentLimit, false)
                                  : Helper.CurrencyFormat(entityCurrentLimit, 0)
                                : typeof individualIRACurrentLimit === 'string'
                                  ? Helper.MoneyMathDisplayCurrency(individualIRACurrentLimit, false)
                                  : Helper.CurrencyFormat(individualIRACurrentLimit, 0)
                              }
                            </Statistic.Value>
                          </Statistic>
                          <Divider clearing hidden />
                          <Button onClick={e => this.handleUpdateInvestmentLimit(e, account.name, account.details.accountId)} inverted color="green" content="Update investment limits" />
                        </Card.Content>
                      </Grid.Column>
                      <Grid.Column computer={8} tablet={8} mobile={16}>
                        {accreditationData[account.name]
                          && accreditationData[account.name].status
                          ? (
                            <Card.Content>
                              <Header as="h5" className={isMobile ? 'plr-0' : ''}>
                                Accredited Investor Status
                            {/* <Link as={Button} to="/" className="link" onClick={e =>
                             this.handleVerifyAccreditation
                            (e, account.name, account.details.accountId)}><small>Update
                             accreditation</small></Link> */}
                              </Header>
                              <dl className="dl-horizontal">
                                <dt>Status :</dt>
                                <dd className={`${this.getStatus(accreditationData[account.name]) === 'Requested' ? 'warning' : this.getStatus(accreditationData[account.name]) === 'Approved' ? 'positive' : 'negative'}-text`}>{this.getStatus(accreditationData[account.name])}</dd>
                                {accreditationData[account.name].status === 'INVALID'
                                  ? (
                                    <>
                                      <dt>Message :</dt>
                                      <dd>{get(accreditationData[account.name], 'reviewed.message') || 'N/A'}</dd>
                                    </>
                                  ) : ''
                                }
                                <dt>{`${this.getStatus(accreditationData[account.name]) === 'Requested' ? 'Requested ' : ['Approved', 'Expired'].includes(this.getStatus(accreditationData[account.name])) ? 'Expiration ' : ''}`}Date :</dt>
                                <dd>{this.getDate(accreditationData[account.name])}</dd>
                              </dl>
                              <Divider hidden />
                              {(accreditationData[account.name].status === 'INVALID' || this.getStatus(accreditationData[account.name]) === 'Expired')
                                ? (
                                  <Card.Description>
                                    <Button onClick={e => this.handleVerifyAccreditation(e, account.name, account.details.accountId)} primary content={this.getStatus(accreditationData[account.name]) === 'Expired' ? 'Re-verify status' : 'Verify Status'} />
                                  </Card.Description>
                                ) : ''
                              }
                            </Card.Content>
                          )
                          : (
                            <Card.Content>
                              <Header as="h4" className={isMobile ? 'plr-0' : ''}>Accredited Investor Status</Header>
                              <p className="intro-text">In order to participate in Reg D 506(c) offerings, you will need to verify your accredited investor status.</p>
                              <Link target="_blank" to="/resources/education-center/investor/what-is-an-accredited-investor" className="intro-text highlight-text">What is an accredited investor?</Link>
                              <Divider hidden />
                              <Card.Description>
                                <Button onClick={e => this.handleVerifyAccreditation(e, account.name, account.details.accountId)} primary content="Verify Status" />
                              </Card.Description>
                            </Card.Content>
                          )
                        }
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Card>
              </Grid.Column>
            </Grid.Row>
          )) : <EmptyDataSet title="No data available for investment limits." />
        }
      </Grid>
    );
  }
}
