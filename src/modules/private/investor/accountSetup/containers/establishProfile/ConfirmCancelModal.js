import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NsInterstitial } from '../../../../../../theme/shared';
import NSImage from '../../../../../shared/NSImage';

@inject('investorProfileStore', 'uiStore', 'individualAccountStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    // const offerings = [
    //   {
    //     title: 'Bravery Chef Hall',
    //     location: 'Houston, TX',
    //     description: 'The next evolution of the food hall, Bravery Cheff Hall in Houston will feature five chef-driven concepts with an immersive dining experience and extensive beverage progam.',
    //     meta1: 'Raised $1,000,000 from 539 investors',
    //     meta2: 'Funded in May 2018',
    //     offeredBy: 'Offered by NextSeed Securities LLC',
    //     imageUrl: `${!isMobile ? 'interstitial/bravery.png' : 'interstitial/braveryMobile.png'}`,
    //   }, {
    //     title: 'Citizen Pilates',
    //     location: 'Houston, TX',
    //     description: 'Boutique Reformer Pilates studio revered for its positive and inclusive envrionment',
    //     meta1: 'Raised $100,000 from 74 investors',
    //     meta2: 'Funded in October 2016',
    //     offeredBy: 'Offered by NextSeed Securities LLC',
    //     imageUrl: `${!isMobile ? 'interstitial/citizens.png' : 'interstitial/citizensMobile.png'}`,
    //   }, {
    //     title: 'Buffbrew Taproom',
    //     location: 'Houston, TX',
    //     description: 'Houston brewery is expanding its facilities and launching the new Buffbrew Taproom, complete with a full-service kitchen, event space and over 40 beers on tap.',
    //     meta1: 'Raised $1,000,000 from 583 investors',
    //     meta2: 'Funded in March 2018',
    //     offeredBy: 'Offered by NextSeed Securities LLC',
    //     imageUrl: `${!isMobile ? 'interstitial/buffbrew.png' : 'interstitial/buffbrewMobile.png'}`,
    //   },
    // ];
    const interstitialSteps = {
      label: 'Profile Interstitial',
      key: 'profileInterstitial',
      steps: [
        {
          stepToBeRendered: 1,
          header: 'Let’s have a look around your new account',
          content: <>Once you’ve made your first investment on NextSeed, use your Dashboard to find information related to your investment portfolio — including payments, updates, returns and more.</>,
          component: <NSImage path={`${!isMobile ? 'interstitial/portfolio.png' : 'interstitial/portfolioMobile.png'}`} />,
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
          content: <>Now that you know the basics of your new NextSeed account, you can go ahead and <Link to="/dashboard/setup">complete your account setup</Link>, or start exploring investment opportunities.</>,
          note: <div className={`protipWrap ${isMobile ? 'dblock' : 'dblock'}`}><strong>Pro tip:</strong> Click the ‘Follow’ button on any campaign to receive regular campaign updates and alerts so that you never miss a chance to invest.</div>,
          // component: <NsOfferingsCards offerings={offerings} isMobile={isMobile} />,
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
        // offerings={offerings}
        endUrl="/offerings"
        url="/dashboard/setup"
        size="large"
      />
    );
  }
}
