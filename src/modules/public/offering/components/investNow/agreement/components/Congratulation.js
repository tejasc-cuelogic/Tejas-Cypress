import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { Header, Button, Icon, Divider, Grid } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';
import { NsModal } from '../../../../../../../theme/shared';
import HtmlEditor from '../../../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 768;
@inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore', 'accreditationStore', 'investmentLimitStore')
@withRouter
@observer
export default class Congratulation extends React.Component {
  constructor(props) {
    super(props);
    this.props.campaignStore.setFieldValue('inInvestmentFlow', false);
    if (this.props.changeInvestment) {
      this.props.uiStore.setFieldvalue('showFireworkAnimation', true);
    } else {
      this.props.campaignStore.setFieldValue('showFireworkAnimation', true);
    }
  }

  componentWillUnmount() {
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.investmentLimitStore.setFieldValue('investNowHealthCheckDetails', {});
    this.props.campaignStore.setFieldValue('inInvestmentFlow', false);
  }

  handleCloseModal = () => {
    const { investAccTypes } = this.props.investmentStore;
    const accountType = investAccTypes && investAccTypes.value ? investAccTypes.value : '-';
    const accountRedirectURL = accountType && accountType !== '-' ? `/dashboard/account-details/${accountType}/portfolio` : '/dashboard/setup';
    const redirectUrl = this.props.refLink || accountRedirectURL;
    this.props.investmentStore.resetData();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push(`${redirectUrl}`);
  }

  handleCloseModalWithRefferalLink = (e) => {
    e.preventDefault();
    this.props.investmentStore.resetData();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push('/dashboard/referrals');
  }

  render() {
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { investmentAmount, investAccTypes } = this.props.investmentStore;
    const { campaign, campaignStatus } = this.props.campaignStore;
    const accountType = investAccTypes && investAccTypes.value ? investAccTypes.value : '-';
    const accountRedirectURL = accountType && accountType !== '-' ? `/dashboard/account-details/${accountType}/portfolio` : '/dashboard/setup';
    const offeringDetailsObj = campaign && !isEmpty(campaign) ? campaign : get(getInvestorAccountById, 'offering');
    const businessName = get(offeringDetailsObj, 'keyTerms.shorthandBusinessName');
    setTimeout(() => {
      if (this.props.changeInvestment) {
        this.props.uiStore.setFieldvalue('showFireworkAnimation', false);
      } else {
        this.props.campaignStore.setFieldValue('showFireworkAnimation', false);
      }
    }, 8500);
    return (
      <>
        <NsModal
          open
          closeIcon
          closeOnRootNodeClick={false}
          onClose={this.handleCloseModal}
          headerLogo
          borderedHeader
          isProgressHeaderDisable
        >
          <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
            <Grid.Column width="9" className="pt-0">
              {
                (campaignStatus.hideConfirmationHeader !== true || campaignStatus.confirmationMessage === '')
                && (
                  <>
                    <Header as="h2">Congratulations!</Header>
                    <Header as="h3">
                      You have invested <span className="positive-text">{campaignStatus.isPreferredEquity ? Helper.CurrencyFormat(investmentAmount) : Helper.CurrencyFormat(investmentAmount, 0)}</span> in {businessName}.
                    </Header>
                  </>
                )
              }
              {campaignStatus.confirmationMessage !== '' && (
                <HtmlEditor
                  readOnly
                  content={campaignStatus.confirmationMessage}
                />
              )}

              {(campaignStatus.hideConfirmationReferral !== true || campaignStatus.confirmationMessage === '')
                && (
                  <>
                    <p className="mt-20">
                      Now, earn an additional $20 credit by giving $20. Invite your
                      friends to build the community together, and you both earn credits.
                    </p>
                    <Divider hidden />
                    <Link to="/" onClick={e => this.handleCloseModalWithRefferalLink(e)} className="text-link">
                      <Icon className="ns-arrow-right" color="green" />
                      Give $20 & Get $20
                    </Link>
                  </>
                )
              }
                <Divider hidden />
                <Button
                  as={Link}
                  primary
                  to={accountRedirectURL}
                >
                  View Portfolio
              </Button>
            </Grid.Column>
          </Grid>
        </NsModal>
      </>
    );
  }
}
