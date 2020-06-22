import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NsInterstitial, NsOfferingsCards } from '../../../../../../theme/shared';
import NSImage from '../../../../../shared/NSImage';

@inject('investorProfileStore', 'uiStore', 'individualAccountStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    const offerings = [
      {
        title: 'Bravery Chef Hall',
        location: 'Houston, TX',
        description: 'The next evolution of the food hall, Bravery Cheff Hall in Houston will feature five chef-driven concepts with an immersive dining experience and extensive beverage progam.',
        meta1: 'Raised $1,000,000 from 539 investors',
        meta2: 'Funded in May 2018',
        offeredBy: 'Offered by NextSeed Securities LLC',
        imageUrl: `${!isMobile ? 'interstitial/bravery.png' : 'interstitial/braveryMobile.png'}`,
      }, {
        title: 'Citizen Pilates',
        location: 'Houston, TX',
        description: 'Boutique Reformer Pilates studio revered for its positive and inclusive envrionment',
        meta1: 'Raised $100,000 from 74 investors',
        meta2: 'Funded in October 2016',
        offeredBy: 'Offered by NextSeed Securities LLC',
        imageUrl: `${!isMobile ? 'interstitial/citizens.png' : 'interstitial/citizensMobile.png'}`,
      }, {
        title: 'Buffbrew Taproom',
        location: 'Houston, TX',
        description: 'Houston brewery is expanding its facilities and launching the new Buffbrew Taproom, complete with a full-service kitchen, event space and over 40 beers on tap.',
        meta1: 'Raised $1,000,000 from 583 investors',
        meta2: 'Funded in March 2018',
        offeredBy: 'Offered by NextSeed Securities LLC',
        imageUrl: `${!isMobile ? 'interstitial/buffbrew.png' : 'interstitial/buffbrewMobile.png'}`,
      },
    ];
    const interstitialSteps = {
      label: 'Profile Interstitial',
      key: 'profileInterstitial',
      steps: [
        {
          stepToBeRendered: 1,
          header: 'Let’s have a look around your new account',
          content: <>Once you’ve made your first investment on NextSeed, this is where you’ll find information related to your investment portfolio — including payments, updates, returns and more.<br /><br />Also, check your Profile Settings to keep your investment limits and Accredited Investor status up to date.</>,
          component: <NSImage path={`${!isMobile ? 'interstitial/portfolio.png' : 'interstitial/portfolioMobile.png'}`} />,
          button: 'Next',
        }, {
          stepToBeRendered: 2,
          header: 'Flexible account options, rigid security',
          content: <>When you invest on NextSeed, you will do so with an FDIC-insured investment account set up with our partner bank, Goldstar Trust.<br /><br />After we verify your identity using bank-level security measures, you will be asked to create one of three types of accounts based on your preference.</>,
          component: <NSImage path={`${!isMobile ? 'interstitial/accounts.png' : 'interstitial/accountsMobile.png'}`} />,
          button: 'Next',
        }, {
          stepToBeRendered: 3,
          header: 'Time to explore your investment opportunities!',
          content: <>Now that you know the basics of your NextSeed account, you can go ahead and <a href={this.props.match.refLink}>complete your account setup</a>, or start exploring our current investment opportunities.</>,
          note: <div className={`protipWrap ${isMobile ? 'dblock' : 'dblock'}`}><strong>Pro tip:</strong> Be sure to click the ‘Follow’ button on any campaign that interests you in order to receive regular campaign updates and alerts so that you never miss a chance to invest.</div>,
          component: <NsOfferingsCards offerings={offerings} isMobile={isMobile} />,
          button: 'Explore All Offerings',
        },
      ],
    };
    return (
      <NsInterstitial
        closeOnDimmerClick={false}
        open
        interstitialSteps={interstitialSteps}
        offerings={offerings}
        endUrl="/offerings"
        url="/dashboard/setup"
        size="large"
      />
    );
  }
}
