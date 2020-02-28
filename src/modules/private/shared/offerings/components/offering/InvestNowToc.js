/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import { arrayMove } from 'react-sortable-hoc';
import InvestNowTocContent from './toc/InvestNowTocContent';
import DraggableMenu from '../../../../../../theme/layout/DraggableMenu';

@inject('manageOfferingStore')
@withRouter
@observer
export default class InvestNowToc extends Component {
  constructor(props) {
    super(props);
    if (props.isExact) {
      props.history.push('1');
    }
    // if (!props.manageOfferingStore.initLoad.includes('INVEST_NOW_TOC_FRM')) {
    //   props.manageOfferingStore.setFormData('INVEST_NOW_TOC_FRM');
    // }
  }

  toggleModal = (val, index = false) => {
    if (index) {
      this.props.manageOfferingStore.removeOne('INVEST_NOW_TOC_FRM', 'toc', index);
    }
  }

  addMore = () => {
    this.props.manageOfferingStore.addMore('INVEST_NOW_TOC_FRM', 'toc');
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const docs = [...this.props.manageOfferingStore.INVEST_NOW_TOC_FRM.fields.toc];
    this.props.manageOfferingStore.reOrderHandle(arrayMove(docs, oldIndex, newIndex), 'INVEST_NOW_TOC_FRM', 'toc');
    this.props.manageOfferingStore.setFieldValue('onDragSaveEnable', true);
  };

  render() {
    const { match } = this.props;
    const { INVEST_NOW_TOC_FRM } = this.props.manageOfferingStore;
    const navItems = [];
    INVEST_NOW_TOC_FRM.fields.toc.map((toc, index) => {
      navItems.push({ title: `TOC ${index + 1}`, to: `${index + 1}`, index });
      return navItems;
    });
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={4} computer={4} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <DraggableMenu secondary vertical match={match} onSortEnd={this.onSortEnd} navItems={navItems} />
              {INVEST_NOW_TOC_FRM.fields.toc.length < 10
              && <Button size="small" color="blue" className="link-button mt-20" onClick={this.addMore}>+ Add another TOC</Button>
              }
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={12} tablet={13} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={props => <InvestNowTocContent refLink={match.url} {...props} index={0} />}
              />
              {
                navItems.map(item => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <InvestNowTocContent refLink={match.url} {...props} index={item.index || 0} />} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
