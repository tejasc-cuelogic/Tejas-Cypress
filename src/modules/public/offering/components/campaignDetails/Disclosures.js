import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';
import Disclosure from './DataRoom/Disclosure';
import { InlineLoader } from '../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
@inject('campaignStore', 'accreditationStore')
@observer
@withRouter
export default class TermsOfUse extends Component {
  componentWillMount() {
    this.props.accreditationStore.getUserAccreditation();
    if (this.props.match.isExact) {
      const { getNavItemsForDataRoom } = this.props.campaignStore;
      if (getNavItemsForDataRoom.length) {
        this.props.history.push(`${this.props.match.url}/${getNavItemsForDataRoom[0].to}`);
      }
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    const { getNavItemsForDataRoom } = this.props.campaignStore;
    if (!getNavItemsForDataRoom.length) {
      return (
        <div className="campaign-content-wrapper">
          <div className="updates-modal">
            <div className="no-updates">
              <InlineLoader text="No Data Room Documents" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <Aux>
        {isMobile &&
          <SecondaryMenu
            secondary
            vertical
            match={match}
            navItems={getNavItemsForDataRoom}
          />
        }
        <div className="campaign-content-wrapper">
          <Grid>
            {!isMobile &&
              <Grid.Column widescreen={3} computer={3} tablet={4} mobile={16}>
                <div className="sticy-sidebar">
                  <SecondaryMenu
                    secondary
                    vertical
                    match={match}
                    navItems={getNavItemsForDataRoom}
                    className="dataroom-menu"
                  />
                </div>
              </Grid.Column>
            }
            <Grid.Column widescreen={13} computer={13} tablet={12} mobile={16}>
              <Switch>
                <Route
                  exact
                  path={`${match.url}/:docKey`}
                  render={
                    props =>
                      (<Disclosure
                        {...props}
                      />)
                  }
                />
                {
                  getNavItemsForDataRoom.map(item => (
                    <Route
                      exact
                      key={item.to}
                      path={`${match.url}/:docKey`}
                      render={
                        props =>
                          (<Disclosure
                            {...props}
                          />)
                      }
                    />
                  ))
                }
              </Switch>
            </Grid.Column>
          </Grid>
        </div>
      </Aux>
    );
  }
}
