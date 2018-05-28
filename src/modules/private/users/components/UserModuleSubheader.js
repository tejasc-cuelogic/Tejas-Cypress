import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Header, List, Icon, Menu, Responsive } from 'semantic-ui-react';
import { USER_DETAIL_SECTIONS } from '../../../../constants/user';

const userModuleSubheader = props => (
  <div>
    <div className="page-header-section">
      <Header as="h1">
        <Responsive
          minWidth={Responsive.onlyLargeScreen.minWidth}
          as={Link}
          to="/app/users"
          className="back-link"
        >
          <Icon className="ns-arrow-left" />
        </Responsive>
        {props.fullname}
        <List horizontal>
          <List.Item>
            <List.Icon circular color="red" className="ns-lock" />
            <List.Content verticalAlign="middle">
              <List.Description>
                Account locked <br />
                <Link to="">Unlock</Link>
              </List.Description>
            </List.Content>
          </List.Item>
        </List>
      </Header>
    </div>
    <div className="secondary-menu">
      <Menu celled="true" horizontal="true" inverted>
        {
          USER_DETAIL_SECTIONS.map(section => (
            <Menu.Item
              key={section}
              as={NavLink}
              className={(props.section.toLowerCase() === section.toLowerCase()) ? 'active' : ''}
              to={`/app/users/${props.id}/${section}`}
            >
              {section}
            </Menu.Item>
          ))
        }
      </Menu>
    </div>
  </div>
);

export default userModuleSubheader;
