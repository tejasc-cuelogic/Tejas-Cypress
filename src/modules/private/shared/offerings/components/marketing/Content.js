import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import { arrayMove } from 'react-sortable-hoc';
import OfferingContent from './Content/OfferingContent';
import DraggableMenu from '../../../../../../theme/layout/DraggableMenu';
import NewContentModal from './Content/NewContentModal';

@inject('manageOfferingStore')
@withRouter
@observer
export default class Content extends Component {
  state = {
    openModal: false,
  }

  constructor(props) {
    super(props);
    if (props.isExact) {
      props.history.push('1');
    }
    if (!props.manageOfferingStore.initLoad.includes('OFFERING_CONTENT_FRM')) {
      props.manageOfferingStore.setFormData('OFFERING_CONTENT_FRM');
    }
  }

  toggleModal = (val, index = false) => {
    this.setState({ openModal: val });
    if (index) {
      this.props.manageOfferingStore.removeOne('OFFERING_CONTENT_FRM', 'content', index);
    }
  }

  checkValidFormIndexZero = () => {
    const fields = this.props.manageOfferingStore.OFFERING_CONTENT_FRM.fields.content[0];
    return (fields.title.value && fields.contentType.value && fields.scope.value);
  }

  addMore = () => {
    if (this.checkValidFormIndexZero()) {
      this.props.manageOfferingStore.addMore('OFFERING_CONTENT_FRM', 'content');
    }
    this.toggleModal(true);
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const docs = [...this.props.manageOfferingStore.OFFERING_CONTENT_FRM.fields.content];
    this.props.manageOfferingStore.reOrderHandle(arrayMove(docs, oldIndex, newIndex), 'OFFERING_CONTENT_FRM', 'content');
    this.props.manageOfferingStore.setFieldValue('onDragSaveEnable', true);
  };

  render() {
    const { match } = this.props;
    const { OFFERING_CONTENT_FRM } = this.props.manageOfferingStore;
    const navItems = [];
    OFFERING_CONTENT_FRM.fields.content.map((content, index) => {
      navItems.push({ title: `${content.title.value !== '' ? content.title.value : `Content Block ${index + 1}`}`, to: `${index + 1}`, index });
      return navItems;
    });
    return (
      <div className="inner-content-spacer">
        {this.state.openModal && <NewContentModal refLink={match.url} toggleModal={this.toggleModal} index={OFFERING_CONTENT_FRM.fields.content.length - 1} />}
        <Grid>
          <Grid.Column widescreen={4} computer={4} tablet={3} mobile={16}>
            <div className="sticky-sidebar">
              <DraggableMenu secondary vertical match={match} onSortEnd={this.onSortEnd} navItems={navItems} />
              {OFFERING_CONTENT_FRM.fields.content.length < 15
              && <Button size="small" color="blue" className="link-button mt-20" onClick={this.addMore}>+ Add another content block</Button>
              }
            </div>
          </Grid.Column>
          <Grid.Column widescreen={12} computer={12} tablet={13} mobile={16}>
            <Switch>
              <Route
                exact
                path={match.url}
                render={props => <OfferingContent refLink={match.url} {...props} index={0} />}
              />
              {
                navItems.map(item => (
                  <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <OfferingContent refLink={match.url} {...props} index={item.index || 0} />} />
                ))
              }
            </Switch>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
