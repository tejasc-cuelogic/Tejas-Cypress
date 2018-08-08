import React, { Component } from 'react';
import Aux from 'react-aux';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { startCase } from 'lodash';
import { Grid, Card, Statistic, Popup, Icon, Button, Divider, Header } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { EmptyDataSet, InlineLoader } from '../../../../../../theme/shared';


@inject('investmentLimitStore', 'uiStore', 'userDetailsStore')
@withRouter
@observer
export default class FinancialInfo extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.investmentLimitStore.updateFinInfo();
  }
  handleUpdateInvestmentLimit =(e, accountType) => {
    e.preventDefault();
    this.props.investmentLimitStore.setInvestmentLimitInfo(accountType);
    this.props.history.push(`${this.props.match.url}/update`);
  }
  handleVerifyAccreditation = () => {
    this.props.history.push(`${this.props.match.url}/verify-accreditation`);
  }
  render() {
    const {
      INVESTEMENT_LIMIT_META, getActiveAccountList,
    } = this.props.investmentLimitStore;
    const { currentUser } = this.props.userDetailsStore;
    const { fields } = INVESTEMENT_LIMIT_META;
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
                    account.accountType === 'ira' && getActiveAccountList.isIndAccExist ?
                      <Aux>
                        <Icon color="teal" className="ns-individual-line" /> Individual
                        <Icon color="teal" className={`ns-${account.accountType}-line`} /> {account.accountType.toUpperCase()}
                      </Aux> :
                      <Aux>
                        <Icon color="teal" className={`ns-${account.accountType}-line`} /> {startCase(account.accountType)}
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
                          Pellentesque facilisis. Nulla imperdiet sit amet magna.
                          Vestibulum dapibus, mauris nec malesuada fames ac turpis
                          Pellentesque facilisis. Nulla imperdiet sit amet
                        </p>
                        <Statistic size="tiny">
                          <Statistic.Label>
                            Your current investment limit
                            <Popup
                              trigger={<Icon className="ns-help-circle" />}
                              content="Your current investment limit as of today"
                              position="top center"
                              className="center-align"
                            />
                          </Statistic.Label>
                          <Statistic.Value>
                            {Helper.CurrencyFormat(account.accountType === 'entity' ? fields.currentLimitEntity.value : fields.currentLimitIndividualOrIra.value)}
                          </Statistic.Value>
                        </Statistic>
                        <Divider clearing hidden />
                        <Button onClick={e => this.handleUpdateInvestmentLimit(e, account.accountType)} inverted color="green" content="Update investment limits" />
                      </Card.Content>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Card.Content>
                        <Header as="h4">Accreditation</Header>
                        <p className="intro-text">This will trigger a modal of 3-4 steps, and show a status</p>
                        <Divider hidden />
                        <Card.Description>
                          <Button onClick={this.handleVerifyAccreditation} primary content="Verify accreditation" />
                        </Card.Description>
                      </Card.Content>
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
