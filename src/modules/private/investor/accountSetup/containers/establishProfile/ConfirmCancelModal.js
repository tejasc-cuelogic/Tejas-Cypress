import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
// import { Button } from 'semantic-ui-react';
import { NsInterstitial } from '../../../../../../theme/shared';
import NSImage from '../../../../../shared/NSImage';

@inject('investorProfileStore', 'uiStore', 'individualAccountStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    // className="link-button" color="green" to={Link} content="complete your account setup"
    const interstitialSteps = {
      label: 'Profile Interstitial',
      key: 'profileInterstitial',
      steps: [
        {
          stepToBeRendered: 1,
          header: <>Let’s have a look around<br />your new account</>,
          content: <>Once you’ve made your first investment on NextSeed, use your Dashboard to find information related to your investment portfolio — including payments, updates, returns and more.</>,
          component: <NSImage path={`${!isMobile ? 'interstitial/portfolio.gif' : 'interstitial/portfolioMobile.png'}`} />,
          imageFooter: '*Sample Portfolio',
          button: 'Next',
        }, {
          stepToBeRendered: 2,
          header: 'The right type of account for your needs',
          content: <>As a NextSeed investor, you&rsquo;ll create one of three types of investment accounts&#185; based on what is right for you. As your needs change or grow, you can always create additional accounts.</>,
          footer: <>&#185; NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA GoldStar Trust Company (&rdquo;GoldStar&rdquo;), which provides FDIC insurance of up to $250,000 for uninvested cash in NextSeed accounts.</>,
          component: <NSImage path={`${!isMobile ? 'interstitial/accounts.png' : 'interstitial/accountsMobile.png'}`} />,
          button: 'Next',
        }, {
          stepToBeRendered: 3,
          header: 'Time to explore your investment opportunities!',
          content: <>Now that you know the basics of your new NextSeed account, you can go ahead and <Link onClick={() => this.props.history.push('/init-dashboard')}>complete your account setup</Link>, or start exploring investment opportunities.</>,
          note: <div className={`protipWrap ${isMobile ? 'dblock' : 'dblock'}`}><strong>Pro tip:</strong> Click the ‘Follow’ button on any campaign to receive regular campaign updates and alerts so that you never miss a chance to invest.</div>,
          component: <NSImage path={`${!isMobile ? 'interstitial/offerings.png' : 'interstitial/offeringsMobile.png'}`} />,
          button: 'Explore Offerings',
        },
      ],
    };
    return (
      <NsInterstitial
        closeOnDimmerClick={false}
        open
        interstitialSteps={interstitialSteps}
        endUrl="/offerings"
        url="/dashboard/setup"
        size="large"
      />
    );
  }
}
