import React from 'react';
import {
  // Button,
  Container,
  // Divider,
  // Grid,
  // Header,
  // Icon,
  Image,
  // List,
  Menu,
  Dropdown,
  // Segment,
  // Visibility,
} from 'semantic-ui-react';
import Logo from '../../assets/images/nextseed_logo_color.svg';

const navigationItems = () => (
  <Menu fixed="top" size="large">
    <Container>
      <Menu.Item as="a" header>
        <Image className="small" src={Logo} alt="NextSeed.com" style={{ marginRight: '1.5em' }} />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item as="a" active>Browse Deals</Menu.Item>
        <Menu.Item as="a">For Investers</Menu.Item>
        <Menu.Item as="a">For Businesses</Menu.Item>
        <Dropdown item simple text="Learn">
          <Dropdown.Menu>
            <Dropdown.Item>Team</Dropdown.Item>
            <Dropdown.Item>Ambassadors</Dropdown.Item>
            <Dropdown.Item>Blog</Dropdown.Item>
            <Dropdown.Item>FAQ</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item as="a">Log In or Sign Up</Menu.Item>
      </Menu.Menu>
    </Container>
  </Menu>
);

// <Menu.Item className="item">
//           <Button as="a">Log in</Button>
//         </Menu.Item>
//         <Menu.Item>
//           <Button as="a" primary>Sign Up</Button>
//         </Menu.Item>
export default navigationItems;
