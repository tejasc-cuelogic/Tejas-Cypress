import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { matchPath } from 'react-router-dom';
import Aux from 'react-aux';
import { Form, Grid, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';
import NotFound from '../../shared/NotFound';

const overrideContainerClass = ['account-details/:accountType/transactions'];
@inject('uiStore', 'navStore')
@observer
class PrivateLayout extends Component {
  render() {
    const { location, navStore } = this.props;
    const pageMeta = navStore.navMeta;
    if (!pageMeta) {
      return <NotFound />;
    }
    return (
      <Aux>
        <div className="page-header-section">
          <Grid columns="equal" stackable>
            <Grid.Row>
              <Grid.Column>
                {!this.props.P0 ?
                  <Header as="h1">{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header> :
                  this.props.P0
                }
              </Grid.Column>
              {!this.props.P4 ? (
                <span className="item notification">
                  {/* <Icon className="ns-bell"
                  onClick={() => this.props.uiStore.updateLayoutState('notificationPanel')} />
                  <span className="unread-count">3</span> */}
                </span>
                ) : (
                  <Grid.Column width={this.props.buttonWidth ? this.props.buttonWidth : 3} floated="right" textAlign="right">{this.props.P4}</Grid.Column>
                )
              }
            </Grid.Row>
          </Grid>
        </div>
        {((pageMeta.subPanel === 1 || this.props.subNav) && !this.props.hideSubNav) &&
          <SecondaryMenu addon={this.props.subNavAddon} noinvert match={this.props.match} attached="bottom" className="secondary-menu" navItems={pageMeta.subNavigations} stepsStatus={this.props.appStepsStatus} />
        }
        {this.props.P1 &&
          <div className="search-filters">
            <Form>
              <Grid stackable>
                <Grid.Row>
                  {this.props.P1}
                </Grid.Row>
              </Grid>
            </Form>
          </div>
        }
        {this.props.P2}
        {this.props.P3}
        {this.props.P5}
        <div className={`${(overrideContainerClass.find(item => matchPath(location.pathname, { path: `/app/${item}` }))) ? '' : 'content-spacer'}`}>
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default PrivateLayout;
