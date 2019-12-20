import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

@inject('offeringCreationStore', 'userStore')
@observer
export default class Content extends Component {
  render() {
    const { match } = this.props;
    const navItems = [{ title: 'Content 1', to: 'leader/1' }, { title: 'Content 2', to: 'leader/2' }];
    const { isIssuer } = this.props.userStore;
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? 'inner-content-spacer' : ''}>
        <Grid>
          <Grid.Column widescreen={4} computer={4} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <SecondaryMenu secondary vertical match={match} navItems={navItems} />
              <Button size="small" color="blue" className="link-button mt-20">+ Add another page</Button>
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={12} tablet={13} mobile={16}>
            {/* <Switch>
              <Route
                exact
                path={match.url}
                render={props => <Leader refLink={match.url} {...props} index={0} />}
              />
              {
                navItems.map((item, index) => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Leader refLink={match.url} {...props} index={index || 0} />} />
                ))
              }
            </Switch> */}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
