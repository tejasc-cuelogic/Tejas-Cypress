import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import Aux from 'react-aux';
import money from 'money-math';
import { Header, Container, Grid, Button } from 'semantic-ui-react';
import Clipboard from 'react-clipboard.js/dist/react-clipboard';
import { Link } from 'react-router-dom';
import { InlineLoader } from './../../../../../theme/shared';
import Helper from '../../../../../helper/utility';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';

let bugsnagClient;
if (process.env.REACT_APP_BUG_SNAG_KEY) {
  bugsnagClient = bugsnag({
    apiKey: process.env.REACT_APP_BUG_SNAG_KEY,
    appType: 'client',
    appVersion: process.env.CI_PIPELINE_ID,
    releaseStage: process.env.REACT_APP_BUG_SNAG_STAGE,
  });
  bugsnagClient.use(bugsnagReact, React);
}

@inject('referralsStore', 'userDetailsStore')
@observer
export default class ReferralsDetails extends Component {
  state = {
    loading: true,
    availableCredit: 0,
    spentCredit: 0,
    totalEarnedCredit: 0,
    totalReferredUsers: 0,
    myShareLink: '',
    emailShareLink: '',
    twitterShareLink: '',
    messengerShareLink: '',
    facebookShareLink: '',
    smsShareLink: '',
    messengerMobileShareLink: '',
  };


  componentWillMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'id');
    if (saasQuatchUserId) {
      this.props.referralsStore.upsertUserReferralCredits(saasQuatchUserId);
    }
  }
  componentDidMount() {
    const { userDetails } = this.props.userDetailsStore;
    const saasQuatchUserId = get(userDetails, 'saasquatch.userId');
    const userId = saasQuatchUserId || get(userDetails, 'id');
    if (userId) {
      this.props.referralsStore.getUserReferralDetails()
        .then((data) => {
          this.setState({
            availableCredit: get(data, 'getUserReferralDetails.availableCredit') || 0,
            spentCredit: get(data, 'getUserReferralDetails.spentCredit') || 0,
            totalEarnedCredit: get(data, 'getUserReferralDetails.totalEarnedCredit') || 0,
            totalReferredUsers: get(data, 'getUserReferralDetails.totalReferredUsers') || 0,
            myShareLink: get(data, 'getUserReferralDetails.myShareLink') || '',
            emailShareLink: get(data, 'getUserReferralDetails.emailShareLink') || '',
            twitterShareLink: get(data, 'getUserReferralDetails.twitterShareLink') || '',
            messengerShareLink: get(data, 'getUserReferralDetails.messengerShareLink') || '',
            facebookShareLink: get(data, 'getUserReferralDetails.facebookShareLink') || '',
            smsShareLink: get(data, 'getUserReferralDetails.smsShareLink') || '',
            messengerMobileShareLink: get(data, 'getUserReferralDetails.messengerMobileShareLink') || '',
            loading: false,
          });
        })
        .catch((e) => {
          this.setState({
            availableCredit: 0,
            spentCredit: 0,
            totalEarnedCredit: 0,
            totalReferredUsers: 0,
            myShareLink: '',
            emailShareLink: '',
            twitterShareLink: '',
            messengerShareLink: '',
            facebookShareLink: '',
            smsShareLink: '',
            messengerMobileShareLink: '',
            loading: false,
          });
          if (bugsnagClient) {
            bugsnagClient.notify(e);
          }
        });
    }
  }

  render() {
    if (this.state.loading) {
      return <InlineLoader />;
    }

    const codeBoxStyle = {
      // width: '250px',
      paddingLeft: '25px',
      paddingRight: '25px',
      fontFamily: 'Lucida Console", Monaco, monospace',
      fontWeight: '600',
      backgroundColor: '#e9edf9',
    };

    const summaryDetails = {
      accountType: 'individual',
      title: false,
      summary: [
        {
          title: 'Available Credit', content: money.format('USD', money.floatToAmount(parseFloat(this.state.availableCredit))) || '', type: 1, info: 'Credits can be used for investment purposes only and cannot be withdrawn. Uninvested credits do not bear interest.',
        },
        {
          title: 'Spent Credit', content: money.format('USD', money.floatToAmount(parseFloat(this.state.spentCredit))) || '', type: 1, info: 'The total amount of credit applied toward investments.',
        },
        {
          title: 'Lifetime Earned Credit', content: money.format('USD', money.floatToAmount(parseFloat(this.state.totalEarnedCredit))) || '', type: 1, info: 'The total amount of credit you have earned with NextSeed.',
        },
        {
          title: 'Friends Referred', content: this.state.totalReferredUsers || '', type: 0, info: 'How many friends you have referred to NextSeed.',
        },
      ],
    };

    // pre render components
    const summaryHeader = <SummaryHeader details={summaryDetails} />;
    const myShareLink = (
      <div className="fluid ui big action input">
        <input id="myReferralLink" type="text" style={codeBoxStyle} value={this.state.myShareLink} readOnly />
        <Clipboard component="button" option-text={() => document.getElementById('myReferralLink').value} onSuccess={() => Helper.toast('Referral link copied! Happy sharing.', 'success')} className="ui teal right labeled icon button">
          <i className="copy icon" />
          Copy
        </Clipboard>
      </div>
    );

    const isMobile = document.documentElement.clientWidth < 768;

    let button3;
    if (isMobile) {
      const link = this.state.smsShareLink;
      button3 = (
        <Button onClick={() => window.open(`${link}`, '_blank')} className="fluid ui olive labeled icon button">
          <i className="comment alternate outline icon" />
          SMS
        </Button>
      );
    } else {
      const link = this.state.messengerShareLink;
      button3 = (
        <Button onClick={() => window.open(`${link}`, '_blank')} className="fluid ui labeled linkedin icon button">
          <i className="facebook messenger icon" />
          Messenger
        </Button>
      );
    }

    const { emailShareLink } = this.state;
    const { twitterShareLink } = this.state;

    let { facebookShareLink } = this.state;
    let button4 = (
      <Button onClick={() => window.open(`${facebookShareLink}`, '_blank')} className="fluid ui labeled facebook icon button">
        <i className="facebook f icon" />
        Share
      </Button>
    );
    if (isMobile) {
      facebookShareLink = this.state.messengerMobileShareLink;
      button4 = (
        <Button onClick={() => window.open(`${facebookShareLink}`, '_blank')} className="fluid ui labeled facebook icon button">
          <i className="facebook f icon" />
          Share
        </Button>
      );
    }

    return (
      <Aux>
        {summaryHeader}
        <br />
        <Container textAlign="center">
          <Header as="h3">
            Give $20, Get $20!
          </Header>
          <Header as="h4">
            Refer a friend to NextSeed.
          </Header>
          <p>
            {/* eslint-disable max-len */}
            When your friends use your referral link to create a NextSeed Investment Account, you both get $20 towards your next investment.
            {/* eslint-enable max-len */}
          </p>
          <p>
            {/* eslint-disable max-len */}
            Share the link below, and use these shortcuts to tell your friends.
            {/* eslint-enable max-len */}
          </p>
        </Container>
        <br />
        <Container textAlign="center">
          <Grid centered>
            <Grid.Column textAlign="center" computer={6} tablet={4} mobile={16}>
              {myShareLink}
            </Grid.Column>
          </Grid>
        </Container>
        <br />
        <Container textAlign="center">
          <Grid centered>
            <Grid.Column textAlign="center" computer={3} tablet={3} mobile={8}>
              <Button onClick={() => window.open(`${emailShareLink}`, '_blank')} className="fluid ui labeled icon button">
                <i className="envelope outline icon" />
                          Email
              </Button>
            </Grid.Column>
            <Grid.Column textAlign="center" computer={3} tablet={3} mobile={8}>
              <Button onClick={() => window.open(`${twitterShareLink}`, '_blank')} className="fluid ui labeled twitter icon button">
                <i className="twitter icon" />
                          Tweet
              </Button>
            </Grid.Column>
            <Grid.Column textAlign="center" computer={3} tablet={3} mobile={8}>
              { button3 }
            </Grid.Column>
            <Grid.Column textAlign="center" computer={3} tablet={3} mobile={8}>
              { button4 }
            </Grid.Column>
          </Grid>
        </Container>
        <br />
        <br />
        <Container textAlign="center">
          <p>
            <em>
              Full referral program terms and conditions may be found <Link className="positive-text" to="/agreements/referral-program-terms-and-conditions/">here</Link>.
            </em>
          </p>

        </Container>
      </Aux>
    );
  }
}
