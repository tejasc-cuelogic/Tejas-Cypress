import React from 'react';
import { Link } from 'react-router-dom';
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

const UserNavigation = (props) => {
  if (props.currentUser) {
    return (
      <Dropdown item simple text={props.currentUser.email}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
          <Dropdown.Item>Log Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  return (
    <Dropdown item simple text="Log In or Sign Up">
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/login">Log In</Dropdown.Item>
        <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const navigationItems = props => (
  <Menu fixed="top" size="large">
    <Container>
      <Menu.Item as={Link} to="/" header>
        <Image className="small" src={Logo} alt="NextSeed.com" style={{ marginRight: '1.5em' }} />
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item as={Link} to="/offerings" >Browse Deals</Menu.Item>
        <Menu.Item as={Link} to="/invest">For Investers</Menu.Item>
        <Menu.Item as="a">For Businesses</Menu.Item>
        <Dropdown item simple text="Learn">
          <Dropdown.Menu>
            <Dropdown.Item>Team</Dropdown.Item>
            <Dropdown.Item>Ambassadors</Dropdown.Item>
            <Dropdown.Item>Blog</Dropdown.Item>
            <Dropdown.Item>FAQ</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <UserNavigation currentUser={props.currentUser} />
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
