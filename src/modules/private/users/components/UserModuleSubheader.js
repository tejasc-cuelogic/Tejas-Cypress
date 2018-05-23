import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Grid, Header, List, Icon, Menu, Responsive } from 'semantic-ui-react';
import { USER_DETAIL_SECTIONS } from '../../../../constants/user';

const userModuleSubheader = props => (
  <div>
    <div className="page-header-section">
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1">
              <Responsive {...Responsive.onlyComputer}>
                <Link to="/app/users" className="back-link"><Icon className="ns-arrow-left" /></Link>
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
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
