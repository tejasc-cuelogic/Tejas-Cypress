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
        <div>
          <div className="page-header-section">
            <Grid stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  {!this.props.P0 ?
                    <Header as="h1">{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header> :
                    this.props.P0
                  }
                </Grid.Column>
                {this.props.P1}
                <Grid.Column width={3} textAlign="center">{this.props.P2}</Grid.Column>
                <Grid.Column width={3} textAlign="right">{this.props.P3}</Grid.Column>
                {!this.props.P4 ? (
                  <Grid.Column floated="right" textAlign="right">
                    <span className="item notification">
                      <Icon className="ns-bell" />
                      <span className="unread-count">3</span>
                    </span>
                  </Grid.Column>
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
        </div>
        <div className="content-spacer">
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default PrivateHOC;
