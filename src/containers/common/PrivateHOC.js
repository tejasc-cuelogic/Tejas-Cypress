/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Header, Icon, Responsive } from 'semantic-ui-react';
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
        <div className="page-header-section">
          <Grid columns="equal" stackable>
            <Grid.Row>
              <Grid.Column>
                {!this.props.P0 ?
                  <Header as="h1">{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header> :
                  this.props.P0
                }
              </Grid.Column>
              {this.props.P1}
              {this.props.P2}
              {this.props.P3}
              {!this.props.P4 ? (
                <span className="item notification">
                  <Icon className="ns-bell" />
                  <span className="unread-count">3</span>
                </span>
                ) : (
                  <Grid.Column width={3} floated="right" textAlign="right">{this.props.P4}</Grid.Column>
                )
              }
            </Grid.Row>
          </Grid>
        </div>
        {this.props.P5}
        {(pageMeta.subPanel === 1 || this.props.subNav) &&
          <SecondaryMenu match={this.props.match} attached="bottom" className="secondary-menu" navItems={pageMeta.subNavigations} />
        }
        <div className="content-spacer">
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default PrivateHOC;
