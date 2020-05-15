import React from 'react';
import { Modal, Container, Grid, Header, Button, Card } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../../../shared/NSImage';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const OfferingsCards = ({ offerings, isMobile }) => (
  <Card.Group itemsPerRow={isMobile ? 1 : 3}>
    {offerings.map(offering => (
      <Card className="bordered center-align">
        <NSImage path={offering.imageUrl} centered />
        <Card.Content>
          <Header as="h5">{offering.title}</Header>
          <Card.Meta>
            {offering.location}
          </Card.Meta>
          <Card.Description>
            <HtmlEditor readOnly content={offering.description} />
          </Card.Description>
          <p><b>{offering.meta1}</b></p>
          <p><b>{offering.meta2}</b></p>
          <p className="more-info">{offering.offeredBy}</p>
        </Card.Content>
      </Card>
    ))}
  </Card.Group>
);

// const AccountTypes = ({ accountTypes }) => (
//   <Grid columns={1}>
//     {accountTypes.map(acc => (
//       <Grid.Row>
//         <h2>{acc.label}</h2>
//         <p>{acc.labelDescription}</p>
//       </Grid.Row>
//     ))}
//   </Grid>
// );

@inject('investorProfileStore', 'uiStore', 'individualAccountStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      compState: 0,
    };
  }

  // handleCloseModal = () => {
  //   this.props.history.push('/dashboard/setup/establish-profile');
  // }

  /* <p className={`${isMobile ? '' : 'center-align'} mt-30 mb-30`}>
  In order to participate in new investments, you will need to complete
  your investor profile.
</p>
<p className={`${isMobile ? '' : 'center-align'} mb-30`}>Visit your Investor Dashboard anytime to complete your profile.</p>
<div className="center-align mt-30">
  <Button fluid={isMobile} primary size="large" onClick={this.handleCloseModal} className="very relaxed" content="Go Back" />
</div>
<div className={`${isMobile ? 'mb-30' : ''} center-align mt-14`}>
  <p><Link to="/dashboard/setup" onClick={this.handleFinishLater}>Finish later</Link></p>
</div> */

  handleNextStep = () => {
    const { compState } = this.state;
    this.setState({ compState: compState + 1 });
  }

  handleFinishLater = () => {
    this.props.history.push('/dashboard/setup');
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    const { isMobile } = responsiveVars;
    const interstitialSteps = [
      {
        step: 1,
        header: 'Let’s have a look around your new account',
        content: <>Once you’ve made your first investment on NextSeed, this is where you’ll find information related to your investment portfolio — including payments, updates, returns and more.<br /><br />Also, check your Profile Settings to keep your investment limits and Accredited Investor status up to date.</>,
        image: `${!isMobile ? 'interstitial/portfolio.png' : 'interstitial/portfolioMobile.png'}`,
      }, {
        step: 2,
        header: 'Flexible account options, rigid security',
        content: <>When you invest on NextSeed, you will do so with an FDIC-insured investment account set up with our partner bank, Goldstar Trust.<br /><br />After we verify your identity using bank-level security measures, you will be asked to create one of three types of accounts based on your preference.</>,
        image: `${isMobile ? 'interstitial/accounts.png' : 'interstitial/accountsMobile.png'}`,
      }, {
        step: 3,
        header: 'Time to explore your investment opportunities!',
        content: <>Now that you know the basics of your NextSeed account, you can go ahead and <a href="/">complete your account setup</a>, or start exploring our current investment opportunities.</>,
        note: <><strong>Pro tip:</strong> Be sure to click the ‘Follow’ button on any campaign that interests you in order to receive regular campaign updates and alerts so that you never miss a chance to invest.</>,
      },
    ];
    const offerings = [
      {
        title: 'Bravery Chef Hall',
        location: 'Houston, TX',
        description: 'The next evolution of the food hall, Bravery Cheff Hall in Houston will feature five chef-driven concepts with an immersive dining experience and extensive beverage progam.',
        meta1: 'Raised $1,000,000 from 539 investors',
        meta2: 'Funded in May 2018',
        offeredBy: 'Offered by NextSeed Securities LLC',
        imageUrl: 'interstitial/bravery.png',
      }, {
        title: 'Citizen Pilates',
        location: 'Houston, TX',
        description: 'Boutique Reformer Pilates studio revered for its positive and inclusive envrionment',
        meta1: 'Raised $100,000 from 74 investors',
        meta2: 'Funded in October 2016',
        offeredBy: 'Offered by NextSeed Securities LLC',
        imageUrl: 'interstitial/citizen.png',
      }, {
        title: 'Buffbrew Taproom',
        location: 'Houston, TX',
        description: 'Houston brewery is expanding its facilities and launching the new Buffbrew Taproom, complete with a full-service kitchen, event space and over 40 beers on tap.',
        meta1: 'Raised $1,000,000 from 583 investors',
        meta2: 'Funded in March 2018',
        offeredBy: 'Offered by NextSeed Securities LLC',
        imageUrl: 'interstitial/buffbrew.png',
      },
    ];
    return (
      <Modal size="large" open className="finish-later" closeIcon onClose={this.handleFinishLater}>
        <Modal.Content>
          {/* <p className={`${isMobile ? '' : 'center-align'} mt-30 mb-30`}>
            In order to participate in new investments, you will need to complete
            your investor profile.
          </p>
          <p className={`${isMobile ? '' : 'center-align'} mb-30`}>Visit your Investor Dashboard anytime to complete your profile.</p>
          <div className="center-align mt-30">
            <Button fluid={isMobile} primary size="large" onClick={this.handleCloseModal} className="very relaxed" content="Go Back" />
          </div>
          <div className={`${isMobile ? 'mb-30' : ''} center-align mt-14`}>
            <p><Link to="/dashboard/setup" onClick={this.handleFinishLater}>Finish later</Link></p>
          </div> */}
          <Container className={`investor-signup-container ${responsiveVars.uptoTablet ? 'pl-10 pr-10 pt-55 pb-55 ' : 'pl-15 pr-15 pt-55 pb-55'}`}>
            {interstitialSteps.map(step => (
              <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} className="">
                <Header as="h3">{step.header}</Header>
                <p>{step.content}</p>
                {step.step === 3
                  ? <Button primary green className="mt-30" as={Link} to="/offerings">Explore All Offerings</Button>
                  : <Button primary green className="mt-30" onClick={this.handleNextStep}>Next</Button>
                }
              </Grid.Column>
              {step === 1 || step === 2
              ? <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16} className="">{step.image}</Grid.Column>
              : (
                <>
                  <OfferingsCards offerings={offerings} isMobile={isMobile} />
                  {step.note}
                </>
                )}
            </Grid>
            ))}
          </Container>
        </Modal.Content>
      </Modal>
    );
  }
}
