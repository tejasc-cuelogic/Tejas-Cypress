import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { matchPath } from 'react-router-dom';
import { Form, Grid, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';
import NotFound from '../../shared/NotFound';

const isMobile = document.documentElement.clientWidth < 768;
const overrideContainerClass = ['account-details/:accountType/transactions'];
@inject('uiStore', 'navStore', 'userStore', 'userDetailsStore')
@observer
class PrivateLayout extends Component {
  render() {
    const { location, navStore } = this.props;
    const pageMeta = navStore.navMeta;
    const { isInvestor } = this.props.userStore;
    const { match } = this.props;
    const {
      processingAccounts,
      partialAccounts,
    } = this.props.userDetailsStore.signupStatus;
    const splittedUrl = match.url.split('/');
    const accType = splittedUrl.pop();
    const isAccProcessing = processingAccounts.includes(accType);
    const isAccPartial = partialAccounts.includes(accType);
    if (!pageMeta) {
      return <NotFound />;
    }
    return (
      <>
        <div className={`page-header-section ${isInvestor ? 'investor' : ''}`}>
          <Grid columns="equal" stackable>
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                {!this.props.hideHeader
                && <Header as={isInvestor ? (isMobile ? 'h5' : 'h3') : 'h1'}>{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header>
                }
              </Grid.Column>
              {!this.props.P4 ? (
                <span className="item notification">
                  {/* <Icon className="ns-bell"
                  onClick={() => this.props.uiStore.updateLayoutState('notificationPanel')} />
                  <span className="unread-count">3</span> */}
                </span>
              ) : (
                  <Grid.Column only="large screen" width={this.props.buttonWidth ? this.props.buttonWidth : 3} floated={!isMobile ? 'right' : ''} textAlign={!isMobile ? 'right' : 'center'}>{this.props.P4}</Grid.Column>
              )
              }
            </Grid.Row>
          </Grid>
        </div>
        {((pageMeta.subPanel === 1 || this.props.subNav) && !this.props.hideSubNav && !(isInvestor && (isAccPartial || isAccProcessing)))
          && <SecondaryMenu addon={this.props.subNavAddon} noinvert refMatch={this.props.refMatch} match={this.props.match} attached="bottom" className={`${isInvestor ? 'investor' : ''} secondary-menu`} navItems={pageMeta.subNavigations} stepsStatus={this.props.appStepsStatus} rightLabel={this.props.rightLabel} />
        }
        {this.props.P1
          && (
<div className="search-filters">
            <Form>
              <Grid stackable>
                <Grid.Row>
                  {this.props.P1}
                </Grid.Row>
              </Grid>
            </Form>
          </div>
          )
        }
        {this.props.P2}
        {this.props.P3}
        {this.props.P5}
        <div className={`${(overrideContainerClass.find(item => matchPath(location.pathname, { path: `/app/${item}` }))) ? '' : 'content-spacer'}`}>
          {this.props.children}
        </div>
      </>
    );
  }
}

export default PrivateLayout;
