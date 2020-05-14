import React from 'react';
import { Modal, Container, Grid, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

// const isMobile = document.documentElement.clientWidth < 768;


@inject('investorProfileStore', 'uiStore')
@observer
@withRouter
export default class ConfirmCancelModal extends React.Component {
  handleCloseModal = () => {
    this.props.history.push('/dashboard/setup/establish-profile');
  }

  handleFinishLater = () => {
    this.props.history.push('/app/summary/');
  }

  render() {
    const { responsiveVars } = this.props.uiStore;
    return (
      <Modal size="large" open className="finish-later">
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
            <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} className="">
                <Header as="h3">Let’s have a look around your new account</Header>
                <p>Once you’ve made your first investment on NextSeed, this is where you’ll find information related to your investment portfolio — including payments, updates, returns and more.</p>
                <p>Also, check your Profile Settings to keep your investment limits and Accredited Investor status up to date.</p>
                <Button primary green className="mt-30">Next</Button>
              </Grid.Column>
              <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16} className=""></Grid.Column>
            </Grid>
          </Container>
          <Container className={`investor-signup-container ${responsiveVars.uptoTablet ? 'pl-10 pr-10 pt-55 pb-55 ' : 'pl-15 pr-15 pt-55 pb-55'}`}>
            <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} className="">
                <Header as="h3">Flexible account options, rigid security</Header>
                <p>When you invest on NextSeed, you will do so with an FDIC-insured investment account set up with our partner bank, Goldstar Trust.</p>
                <p>After we verify your identity using bank-level security measures, you will be asked to create one of three types of accounts based on your preference.</p>
                <Button primary green className="mt-30">Next</Button>
              </Grid.Column>
              <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16} className=""></Grid.Column>
            </Grid>
          </Container>
          <Container className={`investor-signup-container ${responsiveVars.uptoTablet ? 'pl-10 pr-10 pt-55 pb-55 ' : 'pl-15 pr-15 pt-55 pb-55'}`}>
            <Grid>
              <Grid.Column widescreen={6} computer={6} tablet={16} mobile={16} className="">
                <Header as="h3">Time to explore your investment opportunities!</Header>
                <p>Now that you know the basics of your NextSeed account, you can go ahead and complete your account setup, or start exploring our current investment opportunities.</p>
                <Button primary green className="mt-30">Next</Button>
              </Grid.Column>
              <Grid.Column widescreen={10} computer={10} tablet={16} mobile={16} className=""></Grid.Column>
            </Grid>
          </Container>
        </Modal.Content>
      </Modal>
    );
  }
}
