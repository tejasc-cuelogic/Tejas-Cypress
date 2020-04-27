import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Divider, Container } from 'semantic-ui-react';
import { authActions } from '../../../../services/actions';
import Banner from '../components/Banner';
import MetaTagGenerator from '../../../shared/MetaTagGenerator';
import HowItWorks from '../components/HowItWorks';
import MessageModal from '../../../../theme/shared/src/MessageModal';

const metaTagsData = [
  { type: 'meta', name: 'description', content: 'Learn how small business entrepreneurs are using debt crowdfunding on NextSeed to retain ownership in their breweries, restaurants, bars, fitness studios, and more.' },
  { type: 'ogTag', property: 'og:locale', content: 'en_US' },
  { type: 'ogTag', property: 'og:type', content: 'article' },
  { type: 'ogTag', property: 'og:title', content: 'Raise Growth Capital For Your Business | NextSeed' },
  { type: 'ogTag', property: 'og:description', content: 'Learn how small business entrepreneurs are using debt crowdfunding on NextSeed to retain ownership in their breweries, restaurants, bars, fitness studios, and more.' },
  { type: 'ogTag', property: 'og:url', content: window.location.href },
  { type: 'ogTag', property: 'og:site_name', content: 'NextSeed' },
  { type: 'ogTag', property: 'article:publisher', content: 'https://www.facebook.com/thenextseed' },
  { type: 'ogTag', property: 'fb:app_id', content: '1806635959569619' },
  { type: 'ogTag', property: 'og:image', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:secure_url', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'ogTag', property: 'og:image:width', content: '1600' },
  { type: 'ogTag', property: 'og:image:height', content: '1067' },
  { type: 'meta', name: 'twitter:card', content: 'summary_large_image' },
  { type: 'meta', name: 'twitter:description', content: 'Learn how small business entrepreneurs are using debt crowdfunding to retain ownership in their breweries, restaurants, fitness studios, and more.' },
  { type: 'meta', name: 'twitter:title', content: 'Raise Growth Capital For Your Business | NextSeed' },
  { type: 'meta', name: 'twitter:site', content: '@thenextseed' },
  { type: 'meta', name: 'twitter:image', content: 'https://cdn.nextseed.co/dashboard/uploads/IMG_2710.jpg' },
  { type: 'meta', name: 'twitter:creator', content: '@thenextseed' },
];

const modalContent = 'Investor accounts may not be used to apply for business funding. In order to apply to raise capital, log out of your investor account and submit your application with a different email address.';
@inject('navStore', 'userStore', 'authStore', 'uiStore')
@observer
class Business extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInvestorModal: false,
    };
  }

  handleApplyCta = () => {
    if (this.props.authStore.isUserLoggedIn
      && this.props.userStore.isInvestor) {
      this.setState({ isInvestorModal: true });
    } else {
      this.props.uiStore.setAuthRef('/business');
      this.props.history.push('/register');
    }
  }

  handleBack = () => {
    this.setState({ isInvestorModal: false });
    this.props.history.push('/business');
  }

  // copied from private/index.js
  handleLogOut = () => {
    authActions.logout('user')
      .then(() => {
        this.props.history.push('/register');
      }).catch(err => window.logger(err));
  }

  render() {
    const { location } = this.props;
    const { responsiveVars } = this.props.uiStore;
    return (
      <>
        <MetaTagGenerator pathName={location.pathname} metaTagsData={metaTagsData} />
        <Banner handleApplyCta={this.handleApplyCta} />
        <Divider fitted as={!responsiveVars.uptoTablet && Container} />
        <HowItWorks handleApplyCta={this.handleApplyCta} />
        {
          this.state.isInvestorModal
          && (
            <MessageModal
              classExtra="error-2"
              size="small"
              refLink="/business"
              handleBack={this.handleBack}
              content={modalContent}
              additionalData={
                <Button onClick={this.handleLogOut} primary className="m-auto display-block">Logout</Button>
              }
            />
          )
        }
      </>
    );
  }
}

export default Business;
