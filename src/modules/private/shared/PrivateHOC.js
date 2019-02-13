import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Grid, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';
import NotFound from '../../shared/NotFound';

@inject('uiStore', 'navStore')
@observer
class PrivateHOC extends Component {
  render() {
    const pageMeta = this.props.navStore.navMeta;
    if (!pageMeta) {
      return <NotFound />;
    }
    return (
      <Aux>
        <div className="page-header-section">
          <Grid columns="equal" stackable>
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
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
        {this.props.P5}
        {(pageMeta.subPanel === 1 || this.props.subNav) &&
          <SecondaryMenu navCustomClick={this.props.navCustomClick} addon={this.props.subNavAddon} noinvert match={this.props.match} attached="bottom" className="secondary-menu" navItems={pageMeta.subNavigations} stepsStatus={this.props.appStepsStatus} rightLabel={this.props.rightLabel} />
        }
        <div className="content-spacer">
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default PrivateHOC;
