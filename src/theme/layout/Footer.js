/* eslint-disable arrow-body-style  */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Grid } from 'semantic-ui-react';
import Aux from 'react-aux';
import { SocialLinks } from '../shared';
import NSImage from '../../modules/shared/NSImage';

const isMobile = document.documentElement.clientWidth < 768;
const isTablet = document.documentElement.clientWidth < 992;
class Footer extends Component {
  state = { fShowHide: false };
  componentWillMount() {
    if (this.props.path === '/') {
      this.setState({ fShowHide: true });
    } else {
      this.setState({ fShowHide: false });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.path === '/') {
      this.setState({ fShowHide: true });
    } else {
      this.setState({ fShowHide: false });
    }
  }
  toggleShowHide = () => this.setState({ fShowHide: !this.state.fShowHide });

  render() {
    const { path } = this.props;
    // const OfferFooter = ['/offerings/:id/:section?'];
    // const isCampaign = matchPath(path, { path: OfferFooter }) != null;
    // const offeirngDisclaimer = campaign && campaign.keyTerms &&
    //   campaign.keyTerms.offeringDisclaimer ?
    //   campaign.keyTerms.offeringDisclaimer : null;
    // const shorthandBusinessName = campaign && campaign.keyTerms &&
    //   campaign.keyTerms.shorthandBusinessName ?
    //   campaign.keyTerms.shorthandBusinessName : '';
    return (
      // <footer className={isCampaign ? 'offering-footer' : ''}>
      <footer>
        <Container>
          {/* {(OfferFooter.find(item => matchPath(path, { path: item }))) && offeirngDisclaimer &&
            <p className="mb-40 copyright-info">
              <b>{`${shorthandBusinessName} Disclaimer: `}</b>
              <HtmlEditor readOnly content={(offeirngDisclaimer)} />
            </p>
          } */}
          <Grid stackable>
            <Grid.Column computer={6} tablet={16} mobile={16} className="footer-left">
              <div className="footer-left-nav mb-30">
                {/* {(!OfferFooter.find(item => matchPath(path, { path: item }))) &&
                  <Aux path={path}>
                    <Menu text vertical={!isMobile} className={isMobile && 'mb-10'}>
                      <Menu.Item header>Resources</Menu.Item>
                      <Menu.Item as={NavLink} to="/resources/education-center">Ed Center</Menu.Item>
                      <Menu.Item as={NavLink} to="/resources/insights">Insights</Menu.Item>
                    </Menu>
                    <Menu text vertical={!isMobile} className={isMobile && 'mb-10'}>
                      <Menu.Item header>About Us</Menu.Item>
                      <Menu.Item as={NavLink} to="/about/mission">Mission</Menu.Item>
                      <Menu.Item as={NavLink} to="/about/team">Team & Culture</Menu.Item>
                      <Menu.Item as={NavLink} to="/about/careers">Careers</Menu.Item>
                    </Menu>
                  </Aux>
                } */}
                <Menu
                  text
                  vertical={!isTablet}
                  // || (!OfferFooter.find(item => matchPath(path, { path: item })))
                  // className={isTablet && (OfferFooter.find(item => matchPath(path,
                  // { path: item }))) ? 'center-align' : ''}
                  className={isTablet ? 'center-align' : ''}
                >
                  {/* {(!OfferFooter.find(item => matchPath(path, { path: item }))) && */}
                  <Menu.Item header>Legal</Menu.Item>
                  {/* } */}
                  <Menu.Item as={Link} to="/agreements/legal/terms-of-use">Terms of Use</Menu.Item>
                  <Menu.Item as={Link} to="/agreements/legal/privacy-policy">Privacy Policy</Menu.Item>
                  {/* {(!OfferFooter.find(item => matchPath(path, { path: item }))) && */}
                  <Menu.Item as={Link} to="/agreements/legal/legal-documents">Legal Documents</Menu.Item>
                  {/* } */}
                </Menu>
                {/* {(!OfferFooter.find(item => matchPath(path, { path: item }))) && */}
                <Aux path={path}>
                  <div className={isMobile && 'mb-30'}>
                    <NSImage path="secure-horizontal-1.jpg" />
                  </div>
                </Aux>
                {/* } */}
              </div>
              <div className={`${isMobile && 'mb-20'} footer-social`}>
                <SocialLinks />
                <p className={isMobile && 'mt-10'}>© 2019 NextSeed Technologies LLC</p>
              </div>
            </Grid.Column>
            <Grid.Column computer={10} tablet={16} mobile={16} className="copyright-info">
              <p>
                This site is operated by NextSeed Services LLC ({'"'}NextSeed{'"'}), which is
                neither a registered broker-dealer nor funding portal.
              </p>
              <p>
                All securities-related activity is conducted by regulated affiliates of
                NextSeed: NextSeed Securities, LLC, a registered broker dealer and member
                of <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a> (check out
                the background of our broker-dealer on <a href="https://brokercheck.finra.org/firm/summary/291387" target="_blank" rel="noopener noreferrer">BrokerCheck®</a>) or NextSeed US LLC, a
                registered funding portal and member of <a href="https://www.finra.org/" target="_blank" rel="noopener noreferrer">FINRA</a>.
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
                NextSeed does not verify the adequacy, accuracy or completeness of any
                information. Neither NextSeed nor any of its officers, directors, agents and
                employees makes any warranty, express or implied, of any kind whatsoever related
                to the adequacy, accuracy or completeness of any information on this site or the
                use of information on this site. See additional general disclosures <Link to="/agreements/legal/general-disclosures" target="_blank">here</Link>.
              </p>
              <p>
                By accessing this site and any pages thereof, you agree to be bound by the <Link to="/agreements/legal/terms-of-use" target="_blank">Terms of Use</Link> and
                {' '}<Link to="/agreements/legal/privacy-policy" target="_blank">Privacy Policy</Link>.
              </p>
            </Grid.Column>
          </Grid>
        </Container>
      </footer>
    );
  }
}

export default Footer;
