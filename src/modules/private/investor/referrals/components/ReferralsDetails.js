import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Container, Grid, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { InlineLoader } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';
import SummaryHeader from '../../accountDetails/components/portfolio/SummaryHeader';

@inject('referralsStore', 'userDetailsStore', 'userStore')
@observer
export default class ReferralsDetails extends Component {
  constructor(props) {
    super(props);
    const { userStore, userDetailsStore } = this.props;
    if (userStore.isInvestor && get(userDetailsStore, 'signupStatus.activeAccounts') && get(userDetailsStore, 'signupStatus.activeAccounts').length) {
      this.props.referralsStore.getUserReferralDetails(false, false);
    }
  }

  render() {
    const { referralData } = this.props.referralsStore;
    if (referralData.loading) {
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
          title: 'Available Credit', content: referralData.availableCredit || '', type: 1, info: 'Credits can be used for investment purposes only and cannot be withdrawn. Uninvested credits do not bear interest.',
        },
        {
          title: 'Spent Credit', content: referralData.spentCredit || '', type: 1, info: 'The total amount of credit applied toward investments.',
        },
        {
          title: 'Lifetime Earned Credit', content: referralData.totalEarnedCredit || '', type: 1, info: 'The total amount of credit you have earned with NextSeed.',
        },
        {
          title: 'Friends Referred', content: referralData.totalReferredUsers || '', type: 0, info: 'How many friends you have referred to NextSeed.',
        },
      ],
    };

    // pre render components
    const summaryHeader = <SummaryHeader details={summaryDetails} />;
    /* eslint-disable max-len */
    // const myShareLink = (
    //   <div className="fluid ui big action input">
    //     <input id="myReferralLink" type="text" style={codeBoxStyle} value={this.state.myShareLink} readOnly />
    //     <Clipboard component="button" option-text={() => document.getElementById('myReferralLink').value} onSuccess={() => Helper.toast('Referral link copied! Happy sharing.', 'success')} className="ui teal right labeled icon button">
    //       <i className="copy icon" />
    //       Copy
    //     </Clipboard>
    //   </div>
    // );
    /* eslint-enable max-len */

    const myShareLink = (
      <div className="fluid ui big action input">
        <input id="myReferralLink" type="text" style={codeBoxStyle} value={referralData.myShareLink} readOnly />
        <CopyToClipboard text={referralData.myShareLink} onCopy={() => Helper.toast('Referral link copied! Happy sharing.', 'success')}>
          <button type="button" className="ui teal right labeled icon button">
            <i className="copy icon" />
            Copy
          </button>
        </CopyToClipboard>
      </div>
    );

    const isMobile = document.documentElement.clientWidth < 768;

    let button3;
    if (isMobile) {
      const link = referralData.smsShareLink;
      button3 = (
        <Button onClick={() => window.open(`${link}`, '_blank')} className="fluid ui olive labeled icon button">
          <i className="comment alternate outline icon" />
          SMS
        </Button>
      );
    } else {
      const link = referralData.messengerShareLink;
      button3 = (
        <Button onClick={() => window.open(`${link}`, '_blank')} className="fluid ui labeled linkedin icon button">
          <i className="facebook messenger icon" />
          Messenger
        </Button>
      );
    }

    const { emailShareLink, twitterShareLink } = { ...referralData };
    let { facebookShareLink } = referralData;

    let button4 = (
      <Button onClick={() => window.open(`${facebookShareLink}`, '_blank')} className="fluid ui labeled facebook icon button">
        <i className="facebook f icon" />
        Share
      </Button>
    );
    if (isMobile) {
      facebookShareLink = referralData.messengerMobileShareLink;
      button4 = (
        <Button onClick={() => window.open(`${facebookShareLink}`, '_blank')} className="fluid ui labeled facebook icon button">
          <i className="facebook f icon" />
          Share
        </Button>
      );
    }

    return (
      <>
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
      </>
    );
  }
}
