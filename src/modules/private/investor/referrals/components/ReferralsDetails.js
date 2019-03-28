import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Header, Popup, Icon, Container } from 'semantic-ui-react';
import { SAASQUATCH_TENANT_ALIAS } from '../../../../../constants/common';
import { InlineLoader } from './../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

@inject('referralsStore', 'userDetailsStore')
@observer
export default class ReferralsDetails extends Component {
  state = { loading: true, availableCredit: '0' };
  componentWillMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'id');
    if (saasQuatchUserId) {
      this.props.referralsStore.upsertUserReferralCredits(saasQuatchUserId);
    }
    this.props.referralsStore.getUserRewardBalance()
      .then(data => this.setState({
        availableCredit: get(data, 'getUserRewardBalance') || 0,
      }));
  }
  componentDidMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'saasquatch.userId');
    const userId = saasQuatchUserId || get(userDetails, 'id');
    if (userId) {
      this.props.referralsStore.getJwtReferralEmbeddedWidget().then((data) => {
        const payLoad = {
          id: userId,
          accountId: userId,
        };
        if (!saasQuatchUserId) {
          payLoad.email = get(userDetails, 'email.address');
          payLoad.firstName = get(userDetails, 'info.firstName');
          payLoad.lastName = get(userDetails, 'info.lastName');
        }
        window.squatch.ready(() => {
          window.squatch.init({
            tenantAlias: SAASQUATCH_TENANT_ALIAS,
          });
          const initObj = {
            user: payLoad,
            engagementMedium: 'EMBED',
            widgetType: 'REFERRER_WIDGET',
            jwt: data.getJwtReferralEmbeddedWidget,
          };
          window.squatch.widgets().upsertUser(initObj).then((response) => {
            this.setState({ loading: false });
            if (!saasQuatchUserId) {
              this.props.referralsStore.getReferralCreditsInformation(response.user.referralCode);
            }
          }).catch(() => {
            this.setState({ loading: false });
          });
        });
      }).catch(() => this.setState({ loading: false }));
    }
  }
  render() {
    const codeBoxStyle = {
      width: '250px',
      paddingLeft: '25px',
      paddingRight: '25px',
      fontFamily: 'Lucida Console", Monaco, monospace',
      fontWeight: '600',
      backgroundColor: '#e9edf9',
    };
    return (
      <div>
        {this.state.loading ?
          <InlineLoader /> :
          <div>
            <Container textAlign={this.props.isMobile ? 'left' : 'center'}>
              <Header as="h4">
                Available Credit{' '}
                <Popup trigger={<sup><Icon name="help circle" color="green" /></sup>} content="Credits can be used for investment purposes only and cannot be withdrawn. Uninvested credits do not bear interest." position="bottom center" />
                {Helper.MoneyMathDisplayCurrency(this.state.availableCredit)}
              </Header>
            </Container>
            <br />
            <Container textAlign={this.props.isMobile ? 'left' : 'center'}>
              <Header as="h3">
                Give $20, Get $20!
              </Header>
              <Header as="h4">
                Refer a friend to NextSeed.
              </Header>
              <p>
                When they sign up for an investment account, <b>you both get $20</b> in credit to use on the site.
              </p>
              <p className>
                For a limited time, you can <b>invite as many friends as you&apos;d like and earn as much credit as you want.</b> Share the link below and use these shortcuts to tell your friends. The more the merrier!
              </p>
            </Container>
            <br />
            <Container textAlign={this.props.isMobile ? 'left' : 'center'}>
              <div className="ui big action input">
                <input type="text" style={codeBoxStyle} value="MYCODE" readOnly />
                <button className="ui teal right labeled icon button">
                  <i className="copy icon" />
                    Copy
                </button>
              </div>
            </Container>
            <br />
            <Container textAlign={this.props.isMobile ? 'left' : 'center'}>
              <div className="ui buttons">
                <button className="ui labeled icon button">
                  <i className="envelope outline icon" />
                  Email
                </button>
                <button className="ui labeled twitter icon button">
                  <i className="twitter icon" />
                  Tweet
                </button>
                <button className="ui labeled linkedin icon button">
                  <i className="facebook messenger icon" />
                  Messenger
                </button>
                <button className="ui labeled facebook icon button">
                  <i className="facebook f icon" />
                  Share
                </button>
              </div>
            </Container>
          </div>
        }
      </div>
    );
  }
}
