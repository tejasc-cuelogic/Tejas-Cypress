import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Icon, Responsive } from 'semantic-ui-react';
import { USER_DETAIL_SECTIONS } from '../../../constants/user';

const userModuleSubheader = props => (
  <div>
    <div className="page-header-section">
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <h1>
              <Responsive {...Responsive.onlyComputer}>
                <Link to="/app/users" className="back-link"><Icon name="ns-arrow-left" /></Link>
              </Responsive>
              {props.fullname}
              <List horizontal>
                <List.Item>
                  <List.Icon circular color="red" name="ns-lock" />
                  <List.Content verticalAlign="middle">
                    <List.Description>
                      Account locked <br />
                      <Link to="">Unlock</Link>
                    </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </h1>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    <div className="secondary-menu">
      <List celled horizontal inverted>
        {
          USER_DETAIL_SECTIONS.map(section => (
            <List.Item
              className={(props.section.toLowerCase() === section.toLowerCase()) ? 'active' : ''}
              key={section}
              as="a"
              href={`/app/users/1/${section}`}
            >
              {section}
            </List.Item>
          ))
        }
      </List>
    </div>
  </div>
);

export default userModuleSubheader;
