/* eslint-disable arrow-body-style  */
import React, { Component } from 'react';
import { Link, matchPath, withRouter } from 'react-router-dom';
import { Container, Menu, Grid } from 'semantic-ui-react';
import { SocialLinks } from '../shared';
import NSImage from '../../modules/shared/NSImage';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;
@withRouter
class Footer extends Component {
  componentDidMount() {
    setTimeout(() => {
      if (this.props.location.hash === '#site-footer') {
        document.querySelector(`${this.props.location.hash}`).scrollIntoView({
          block: 'start',
        });
      }
    }, 500);
  }

  render() {
    const { path } = this.props;
    const OfferFooter = ['/offerings/:id/:section?'];
    const isCampaign = matchPath(path, { path: OfferFooter }) !== null;
    const isNewCampaign = this.props.location.pathname.startsWith('/offerings');
    return (
      <footer id="site-footer" className={`${isCampaign ? 'offering-footer' : ''} ${isNewCampaign && isTablet ? 'offering-footer-v2' : ''}`}>
        <Container>
          <Grid stackable>
            <Grid.Column computer={6} tablet={16} mobile={16} className="footer-left">
              <div className="footer-left-nav mb-30">
                <Menu
                  text
                  vertical
                  className={isTablet ? 'center-align m-auto' : ''}
                >
                  <Menu.Item header>Legal</Menu.Item>
                  <Menu.Item as={Link} to="/agreements/legal/terms-of-use">Terms of Use</Menu.Item>
                  <Menu.Item as={Link} to="/agreements/legal/privacy-policy">Privacy Policy</Menu.Item>
                  <Menu.Item as={Link} to="/agreements/legal/legal-documents">Legal Documents</Menu.Item>
                </Menu>
                <>
                  <div className={isTablet && 'mt-20 center-align'}>
                    <a href="https://www.aoiplatforms.org/" target="_blank" rel="noopener noreferrer">
                      <NSImage path="aoip.png" />
                    </a>
                  </div>
                </>
                <>
                  <div className={`grey-header mt-30 ${isMobile && 'mt-20 center-align'}`}>
                    <b>Have a question?</b>
                    <p className="copyright-info">Contact us at <a className="social-links" href="mailto:support@nextseed.com">support@nextseed.com</a></p>
                  </div>
                </>
              </div>
            </Grid.Column>
            <Grid.Column computer={10} tablet={16} mobile={16} className="copyright-info grey-header">
              <p>
                This site is operated by NextSeed Services LLC ({'"'}NextSeed{'"'}), which is
                neither a registered broker-dealer nor funding portal.
              </p>
              <p>
                All securities-related activity is conducted by regulated affiliates of
                NextSeed: NextSeed Securities, LLC, a registered broker dealer and member
                of <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>{' '}
                <b>(check out the background of our broker-dealer on{' '}
                  <a href="https://brokercheck.finra.org/firm/summary/291387" target="_blank" rel="noopener noreferrer">BrokerCheck®</a>)
                </b>{' '}
                or NextSeed US LLC, a registered funding portal and member of <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>.
              </p>
              <p>
                Any securities offered on this website have not been recommended or approved
                by any federal or state securities commission or regulatory authority. NextSeed
                and its affiliates do not provide any investment advice or recommendation and
                does not provide any legal or tax advice with respect to any securities. All
                securities listed on this site are being offered by, and all information included
                on this site is the responsibility of, the applicable issuer of such securities.
                In making an investment decision, investors must rely on their own examination of
                the issuer and the terms of the offering, including the merits and risks involved.
                Investments on NextSeed are speculative, illiquid and involve a high degree of
                risk, including the possible loss of your entire investment.{' '}
                <b>See general risk factors{' '}
                  <a href="https://nextseed.com/agreements/legal/general-risk-factors" target="_blank" rel="noopener noreferrer">here</a>
                </b>.
                See additional general disclosures <Link to="/agreements/legal/general-disclosures" target="_blank">here</Link>.
              </p>
              <p>
                By accessing this site and any pages thereof, you agree to be bound by the <Link to="/agreements/legal/terms-of-use" target="_blank">Terms of Use</Link> and
                {' '}<Link to="/agreements/legal/privacy-policy" target="_blank">Privacy Policy</Link>.
              </p>
              <div className="mt-20 footer-social grey-header">
                <SocialLinks />
                <span className={`ml-18 ${isMobile && 'mt-20'}`}>© 2020 NextSeed Technologies LLC</span>
              </div>
            </Grid.Column>
          </Grid>
        </Container>
      </footer>
    );
  }
}

export default Footer;
