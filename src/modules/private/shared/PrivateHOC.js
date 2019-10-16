import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../theme/layout/SecondaryMenu';
import NotFound from '../../shared/NotFound';

const isMobile = document.documentElement.clientWidth < 768;
@inject('uiStore', 'navStore', 'userStore')
@observer
class PrivateHOC extends Component {
  render() {
    const pageMeta = this.props.navStore.navMeta;
    const { isInvestor } = this.props.userStore;
    if (!pageMeta) {
      return <NotFound />;
    }
    return (
      <>
        <div className={`${isInvestor ? 'investor' : ''} page-header-section`}>
          <Grid columns="equal" stackable>
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                {!this.props.P0
                  ? <Header as={isInvestor ? 'h3' : 'h1'}>{this.props.forceTitle || pageMeta.heading || pageMeta.title}</Header>
                  : this.props.P0
                }
              </Grid.Column>
              {this.props.P1}
              {this.props.P2}
              {this.props.P3}
              {!this.props.P4 ? (
                <span className="item notification">
                  {/* <Icon className="ns-bell" onClick={() =>
                  this.props.uiStore.updateLayoutState('notificationPanel')} />
                  <span className="unread-count">3</span> */}
                </span>
              ) : (
                  <Grid.Column width={this.props.buttonWidth ? this.props.buttonWidth : 3} floated="right" textAlign="right">{this.props.P4}</Grid.Column>
              )
              }
            </Grid.Row>
          </Grid>
        </div>
        {!isInvestor && this.props.P5}
        {(pageMeta.subPanel === 1 || this.props.subNav)
          && <SecondaryMenu navCustomClick={this.props.navCustomClick} addon={this.props.subNavAddon} noinvert refMatch={this.props.refMatch} match={this.props.match} attached="bottom" className="secondary-menu" navItems={pageMeta.subNavigations} stepsStatus={this.props.appStepsStatus} rightLabel={this.props.rightLabel} />
        }
        <div className={`${isInvestor && isMobile ? 'pt-0' : ''} content-spacer`}>
        {isInvestor && this.props.P5}
          {this.props.children}
        </div>
      </>
    );
  }
}

export default PrivateHOC;
