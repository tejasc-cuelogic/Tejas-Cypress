import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { matchPath, Link } from 'react-router-dom';
import { Form, Grid, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';
import NotFound from '../../shared/NotFound';
import { Logo } from '../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;
const overrideContainerClass = ['account-details/:accountType/transactions'];
@inject('uiStore', 'navStore', 'userStore')
@observer
class PrivateLayout extends Component {
  render() {
    const { location, navStore } = this.props;
    const pageMeta = navStore.navMeta;
    const { isInvestor } = this.props.userStore;
    if (!pageMeta) {
      return <NotFound />;
    }
    return (
      <>
      {isMobile && isInvestor
      && (
        <Link to="/"><Logo
          dataSrc="LogoGreenGrey"
          className="mobile-header-logo"
        /></Link>
      )
      }
        <div className={`page-header-section ${isInvestor ? 'investor' : ''}`}>
          <Grid columns="equal" stackable>
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                {!this.props.P0
                  ? <Header as={isInvestor ? 'h3' : 'h1'}>{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header>
                  : this.props.P0
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
        {((pageMeta.subPanel === 1 || this.props.subNav) && !this.props.hideSubNav)
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
