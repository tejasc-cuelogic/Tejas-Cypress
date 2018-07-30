import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Menu, Icon, Image } from 'semantic-ui-react';
import secure from '../../assets/images/secure.png';

const footer = () => (
  <footer>
    <div className="footer-head">
      <Container>
        <Menu inverted borderless>
          <Menu.Item as={Link} to="/resources/education-center">Resources <Icon name="caret down" /></Menu.Item>
          <Menu.Item>About Us <Icon name="caret down" /></Menu.Item>
          <Menu.Item>Contact</Menu.Item>
          <Menu.Item>Terms of Use</Menu.Item>
          <Menu.Item>Privacy Policy</Menu.Item>
          <Menu.Item>Sign Up for Newsletter</Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>© 2018 NextSeed US LLC</Menu.Item>
            <Menu.Item><Icon name="instagram" /></Menu.Item>
            <Menu.Item><Icon name="twitter" /></Menu.Item>
            <Menu.Item><Icon name="facebook" /></Menu.Item>
          </Menu.Menu>
        </Menu>
      </Container>
    </div>
    <section>
      <Container>
        <Menu text vertical>
          <Menu.Item as={NavLink} to="/resources/education-center">Ed Center</Menu.Item>
          <Menu.Item>Case Studies</Menu.Item>
          <Menu.Item as={NavLink} to="/resources/insights">Insights</Menu.Item>
          <Menu.Item>Community</Menu.Item>
          <Menu.Item href="/about/faq">FAQs</Menu.Item>
        </Menu>
        <Menu text vertical>
          <Menu.Item>Mission</Menu.Item>
          <Menu.Item href="/about/team">Team & Culture</Menu.Item>
          <Menu.Item>Careers</Menu.Item>
          <Menu.Item>Ambassadors</Menu.Item>
          <Menu.Item>Press</Menu.Item>
        </Menu>
        <div className="secure">
          <Image src={secure} />
        </div>
        <div className="copyright-info">
          This site is operated by NextSeed US LLC (`NextSeed`), a Funding Portal registered with
          the U.S. Securities and Exchange Commission (the `SEC`), for the purpose of offering
          and selling securities in accordance with the exemption from securities registration
          requirements contained in Section 4(a)(6) of the Securities Act of 1933 and the
          regulations promulgated by the SEC. NextSeed helps privately held small businesses
          issue debt securities such as term notes and revenue sharing notes to investors...
          Read More
        </div>
      </Container>
    </section>
  </footer>
);

export default footer;
