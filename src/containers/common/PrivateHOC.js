import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Button, Icon, Responsive } from 'semantic-ui-react';
import { GetNavMeta } from '../../theme/layout/SidebarNav';
import SecondaryMenu from '../../theme/layout/SecondaryMenu';

@inject('userStore', 'uiStore')
@observer
class PrivateHOC extends Component {
  render() {
    const pathInfo = this.props.location.pathname.split('/app/');
    const pageMeta = GetNavMeta(pathInfo[1]);
    const { roles } = toJS(this.props.userStore.currentUser);
    return (
      <Aux>
        <div>
          <div className="page-header-section">
            <Header as="h1">
              <div className="pull-right">
                <span className="item notification">
                  <Icon className="ns-bell" />
                  <span className="unread-count">3</span>
                </span>
                {roles.includes('investor') &&
                  <Responsive
                    {...Responsive.onlyLargeScreen}
                    as={Button}
                    content="Invest Now"
                    primary
                    floated="right"
                  />
                }
              </div>
              {pageMeta.heading || pageMeta.title}
            </Header>
          </div>
          {this.props.StickyNotification &&
            <div className="top-cta-section">
              <Responsive {...Responsive.onlyComputer}>
                {this.props.StickyNotification}
              </Responsive>
            </div>
          }
          {pageMeta.subPanel === 1 &&
            <SecondaryMenu match={this.props.match} attached="bottom" className="secondary-menu" navItems={pageMeta.subNavigations} />
          }
        </div>
        <div className="content-spacer">
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default PrivateHOC;
