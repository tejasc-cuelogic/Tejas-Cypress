import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Icon, Responsive } from 'semantic-ui-react';
import { USER_DETAIL_SECTIONS } from '../../../constants/user';

const userModuleSubheader = props => (
  <div className="page-header-section webcontent-spacer">
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <h1>
            <Responsive {...Responsive.onlyComputer}>
              <Link to="/app/users" className="back-link"><Icon name="long arrow left" /></Link>
            </Responsive>
            {props.fullname}
          </h1>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <List horizontal link>
            {
              USER_DETAIL_SECTIONS.map(section => (
                <List.Item
                  className={(props.section.toLowerCase() === section.toLowerCase()) ? 'active' : ''}
                  key={section}
                  as="a"
                  href={`/app/users/${props.id}/${section}`}
                >
                  {section}
                </List.Item>
              ))
            }
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

export default userModuleSubheader;
