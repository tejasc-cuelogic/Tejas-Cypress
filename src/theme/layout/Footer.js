import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Menu, Icon, Image, Responsive, Divider } from 'semantic-ui-react';
import Aux from 'react-aux';
import secure from '../../assets/images/secure-horizontal-1.png';
import { SocialLinks } from '../shared';

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
    return (
      <footer>
        <Responsive minWidth={768} as={Aux}>
          <div className="footer-head">
            <Container>
              <Menu inverted borderless>
                <Menu.Item onClick={this.toggleShowHide}>Resources <Icon name={`caret ${(this.state.fShowHide ? 'up' : 'down')}`} /></Menu.Item>
                <Menu.Item onClick={this.toggleShowHide}>About Us <Icon name={`caret ${(this.state.fShowHide ? 'up' : 'down')}`} /></Menu.Item>
                <Menu.Item as={Link} to="/agreements/terms-of-use">Terms of Use</Menu.Item>
                <Menu.Item as={Link} to="/agreements/privacy-policy">Privacy Policy</Menu.Item>
                <Menu.Menu position="right">
                  <Menu.Item>© 2018 NextSeed US LLC</Menu.Item>
                  <SocialLinks />
                </Menu.Menu>
              </Menu>
            </Container>
          </div>
        </Responsive>
        <Container className="clearfix">
          <section className={this.state.fShowHide ? 'active' : 'inactive'}>
            <div className="footer-left">
              <Menu text vertical>
                <Menu.Item as={NavLink} to="/resources/education-center">Ed Center</Menu.Item>
                <Menu.Item as={NavLink} to="/resources/insights">Insights</Menu.Item>
              </Menu>
              <Menu text vertical>
                <Menu.Item as={NavLink} to="/about/mission">Mission</Menu.Item>
                <Menu.Item as={NavLink} to="/about/team">Team & Culture</Menu.Item>
                <Menu.Item as={NavLink} to="/about/careers">Careers</Menu.Item>
                <Menu.Item as={NavLink} to="/about/press">Press</Menu.Item>
              </Menu>
              <Responsive minWidth={768} as={Aux}>
                <div className="secure">
                  <Image src={secure} />
                </div>
              </Responsive>
            </div>
            <Responsive maxWidth={767} as={Aux}>
              <Divider hidden />
            </Responsive>
            <div className="copyright-info">
              <p>
                This site is operated by NextSeed Technologies LLC (&quot;NextSeed&quot;), which is
                neither a registered broker-dealer nor Funding Portal. All offerings of securities
                are made through NextSeed US LLC, a registered funding portal and member of FINRA.
              </p>
              <p>
                Securities offered on NextSeed have not been recommended or approved by any federal
                or state securities commission or regulatory authority. NextSeed and its affiliates
                do not provide any investment advice or recommendation and does not provide any
                legal or tax advice with respect to any securities. All securities listed on this
                site are being offered by, and all information included on this site is the
                responsibility of, the applicable issuer of such securities. In making an
                investment decision, investors must rely on their own examination of the issuer
                and the terms of the offering, including the merits and risks involved. NextSeed
                does not verify the adequacy, accuracy or completeness of any information. Neither
                NextSeed nor any of its officers, directors, agents and employees makes any
                warranty, express or implied, of any kind whatsoever related to the adequacy,
                accuracy or completeness of any information on this site or the use of information
                on this site. By accessing this site and any pages thereof, you agree to be bound
                by the Terms of Use and Privacy Policy.
              </p>
            </div>
            <Responsive maxWidth={767} as={Aux}>
              <div className="secure">
                <Image src={secure} />
              </div>
            </Responsive>
          </section>
        </Container>
      </footer>
    );
  }
}

export default Footer;
