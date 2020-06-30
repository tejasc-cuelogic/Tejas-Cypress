import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Container, Button, Dimmer, Loader } from 'semantic-ui-react';

// const highlights = {
//   title: <span style={{ fontSize: '37px' }}>Invest in Small Businesses.<br /></span>,
//   subTitle: <a style={{ pointerEvents: 'none', fontSize: '37px' }}>Invest in the Recovery.</a>,
//   description: <p className="mb-40">This battle with COVID-19 is affecting all of us. The small businesses that define our communities,
//   enrich our lives, and support our local economies are fighting to survive the financial effects of this pandemic.
//   We believe that now, more than ever, it is important to foster meaningful investments in businesses that need community
//   capital to grow. <br /><br />Create a free NextSeed Investor Account to begin exploring community-building alternative investment opportunities.</p>,
// };

// const bannerButtonsMeta = [
//   {
//     label: <><a style={{ pointerEvents: 'none' }}>New! {' '}</a>Raise additional working capital with a Community Bridge Note</>,
//     description: 'The NextSeed Community Bridge Note (CBN) is a special financing product providing an alternative and efficient way to raise flexible, lower cost, lower fee financing.',
//     link: '/insights/community-bridge-notes',
//     // eslint-disable-next-line react/jsx-no-target-blank
//     note: <><a href="https://www.nextseed.com/insights/businesses-affected-by-coronavirus" target="_blank">Stay up to date</a> on all the business relief programs available to small businesses impacted by COVID-19.</>,
//     showBusiness: true,
//   },
//   {
//     label: 'Invest in local businesses',
//     description: 'By investing in small businesses, investors can participate in the recovery of establishments and companies that they care about.',
//     link: '/offerings',
//     note: <><a href="#news-letter ">Sign up for our newsletter</a> to be nofitied when our new CBN product is open for investment.</>,
//     showInvestor: true,
//   },
//   {
//     label: 'Donate to the LIFE Fund',
//     description: 'Make a tax-deductible donation to the Local Impact + Food Entrepreneurs (LIFE) Fund, supporting restaurants and delivering meals to front line healthcare workers.',
//     link: 'https://www.betterunite.com/lifefund',
//     showLifeFund: true,
//   },
// ];

@inject('navStore', 'userDetailsStore', 'authStore', 'userStore', 'uiStore')
@withRouter
@observer
class Banner extends Component {
  lifeFundUrl = (link) => {
    window.open(link, '_blank');
    this.props.history.push('/');
  }

  render() {
    const { isInvestor } = this.props.userStore;
    const { isUserLoggedIn } = this.props.authStore;
    const { signupStatus, pendingStep } = this.props.userDetailsStore;
    const { stepInRoute } = this.props.navStore;
    const showButton = (!isUserLoggedIn || (isUserLoggedIn && isInvestor));
    const isFullInvestor = isInvestor && get(signupStatus, 'activeAccounts') && get(signupStatus, 'activeAccounts').length;
    const redirectUrl = isUserLoggedIn ? (isFullInvestor ? '/offerings' : pendingStep) : `${get(stepInRoute, 'to')}`;
    const { responsiveVars } = this.props.uiStore;

    return (
      <section className="banner business-banner">
        <Container>
          <div className="banner-caption">
            <Header as="h2">
              Expand your portfolio.<br />Invest in small business.
            </Header>
            { showButton
              ? (
                <Button
                  className={`${responsiveVars.isMobile && 'mb-50'} relaxed`}
                  primary
                  content="Get Started"
                  as={Link}
                  to={redirectUrl}
                  fluid={responsiveVars.isMobile}
                />
              ) : ''
            }
          </div>
          <div className="banner-meta">
            <p>
              Bravery Chef Hall<br /><b>Raised $1,000,000 from 539  investors</b>
            </p>
          </div>
        </Container>
        {this.props.withDimmer && (
          <Dimmer active className="fullscreen">
            <Loader active>Loading..</Loader>
          </Dimmer>
        )}
      </section>
      // <>
      //   <div className="bg-offwhite banner-wrapper">
      //     <Grid className="mlr-0">
      //       <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} className={responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-100 pb-100'}>
      //         <Header as={responsiveVars.isTabletLand ? 'h3' : 'h2'}>
      //           {highlights.title}
      //           {highlights.subTitle}
      //         </Header>
      //         {highlights.description}
      //         {showButton
      //           ? (
      //             <Button
      //               primary
      //               content="Get Started"
      //               as={Link}
      //               to={redirectUrl}
      //               fluid={responsiveVars.isMobile}
      //             />
      //           ) : ''
      //         }
      //       </Grid.Column>
      //       <Grid.Column widescreen={8} computer={8} tablet={16} mobile={16} className={`${responsiveVars.uptoTablet ? 'pt-50 pb-50' : 'pt-70 pb-70'} banner-section`}>
      //         {
      //           bannerButtonsMeta.map(i => (
      //             <>
      //               {i.showInvestor && <Header as="h4" className="mb-20"><b>Are you an investor?</b></Header>}
      //               {i.showBusiness && <Header as="h4" className="mb-20"><b>Are you a business owner?</b></Header>}
      //               <Button
      //                 basic
      //                 fluid
      //                 labelPosition="left"
      //                 className="arrow-button bg-white"
      //                 onClick={() => (
      //                   i.showLifeFund ? this.lifeFundUrl(i.link) : this.props.history.push(i.link)
      //                 )}
      //               >
      //                 <div className="details">
      //                   <Header as="h5" className="mb-0">{i.label}</Header>
      //                   {i.description}
      //                 </div>
      //                 <Icon className="ns-chevron-right" color="grey" />
      //               </Button>
      //               {i.note && <p className="details mt-20">{i.note}</p>}
      //             </>
      //           ))
      //         }
      //       </Grid.Column>
      //     </Grid>
      //   </div>
      // </>
    );
  }
}

export default Banner;
