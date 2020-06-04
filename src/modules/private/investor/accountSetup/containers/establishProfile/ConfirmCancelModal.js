import React from 'react';
import { Modal, Container, Grid, Header, Button, Card } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../../../shared/NSImage';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const OfferingsCards = ({ offerings, isMobile }) => (
  <Card.Group itemsPerRow={isMobile ? 1 : 3}>
    {offerings.map(offering => (
      <Card className="bordered center-align investmentCards">
        {!isMobile
          ? (
            <>
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
            </>
          )
          : (
            <>
              <NSImage path={offering.imageUrl} left />
              <Card.Content>
                <Header as="h5">{offering.title}</Header>
                <Card.Description>
                  <HtmlEditor readOnly content={offering.meta1} />
                </Card.Description>
              </Card.Content>
            </>
          )
        }
      </Card>
    ))}
  </Card.Group>
  );

const ProgressBar = ({ activeStep, activeIndex }) => (
  <span className="steps" style={activeStep === activeIndex ? { backgroundColor: '#20C86D' } : { backgroundColor: '#E6E6E8' }} />
);

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
        stepToBeRendered: 1,
        header: 'Let’s have a look around your new account',
        content: <>Once you’ve made your first investment on NextSeed, this is where you’ll find information related to your investment portfolio — including payments, updates, returns and more.<br /><br />Also, check your Profile Settings to keep your investment limits and Accredited Investor status up to date.</>,
        image: `${!isMobile ? 'interstitial/portfolio.png' : 'interstitial/portfolioMobile.png'}`,
        button: 'Next',
        to: `${this.handleNextStep}`,
      }, {
        stepToBeRendered: 2,
        header: 'Flexible account options, rigid security',
        content: <>When you invest on NextSeed, you will do so with an FDIC-insured investment account set up with our partner bank, Goldstar Trust.<br /><br />After we verify your identity using bank-level security measures, you will be asked to create one of three types of accounts based on your preference.</>,
        image: `${!isMobile ? 'interstitial/accounts.png' : 'interstitial/accountsMobile.png'}`,
        button: 'Next',
        to: `${this.handleNextStep}`,
      }, {
        stepToBeRendered: 3,
        header: 'Time to explore your investment opportunities!',
        content: <>Now that you know the basics of your NextSeed account, you can go ahead and <a href={this.props.match.refLink}>complete your account setup</a>, or start exploring our current investment opportunities.</>,
        note: <div className={`protipWrap ${isMobile ? 'dnone' : 'dblock'}`}><strong>Pro tip:</strong> Be sure to click the ‘Follow’ button on any campaign that interests you in order to receive regular campaign updates and alerts so that you never miss a chance to invest.</div>,
        button: 'Explore All Offerings',
        to: '/offerings',
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
    const currentStep = interstitialSteps[this.state.compState];
    return (
      <Modal size="large" open className="finish-later" closeIcon onClose={this.handleFinishLater}>
        <Modal.Content>
          <Container className={`investor-signup-container ${responsiveVars.uptoTablet ? 'pl-10 pr-10 pt-55 pb-55 ' : 'pl-15 pr-15 pt-55 pb-55'}`}>
            <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} className="">
                <Header as="h3">{currentStep.header}</Header>
                <p>{currentStep.content}</p>
                <div className={isMobile ? 'dnone' : 'dblock'}>
                  {currentStep.stepToBeRendered === 3
                    ? <Button primary green className="mt-30" as={Link} to={currentStep.to}>{currentStep.button}</Button>
                    : <Button primary green className="mt-30" onClick={() => this.handleNextStep()}>{currentStep.button}</Button>
                  }
                </div>
                <div className={`progressWrap ${isMobile ? 'dnone' : 'dblock'}`}>
                  {interstitialSteps.map((step, index) => (
                    <ProgressBar
                      activeStep={this.state.compState}
                      activeIndex={index}
                    />
                  ))}
                </div>
              </Grid.Column>
              <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16} className="">
                {currentStep.stepToBeRendered === 1 || currentStep.stepToBeRendered === 2
                  ? <NSImage path={currentStep.image} />
                  : <OfferingsCards offerings={offerings} isMobile={isMobile} />
                }
                <div className={isMobile ? 'dblock' : 'dnone'}>
                  {currentStep.stepToBeRendered === 3
                    ? <Button primary green className="mt-30" as={Link} to={currentStep.to}>{currentStep.button}</Button>
                    : <Button primary green className="mt-30" onClick={() => this.handleNextStep()}>{currentStep.button}</Button>
                  }
                </div>
                <div className={`progressWrap ${isMobile ? 'dblock' : 'dnone'}`}>
                  {interstitialSteps.map((step, index) => (
                    <ProgressBar
                      activeStep={this.state.compState}
                      activeIndex={index}
                    />
                  ))}
                </div>
                {currentStep.note && currentStep.note}
              </Grid.Column>
            </Grid>
          </Container>
        </Modal.Content>
      </Modal>
    );
  }
}
