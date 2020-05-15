/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { arrayMove } from 'react-sortable-hoc';
import { Switch, Route } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import DraggableMenu from '../../../../theme/layout/DraggableMenu';
import CollectionContent from '../../admin/collections/components/CollectionContent';
import NewContentModal from '../../admin/collections/components/NewContentModal';

function ContentHOC(WrappedComponent, metaInfo) {
  return inject(metaInfo.store)(observer((class extends React.Component {
    state = {
      openModal: false,
    };

    toggleModal = (val, index = false) => {
      this.setState({ openModal: val });
      if (index) {
        this.props[metaInfo.store].removeOne(metaInfo.form, 'content', index);
      }
    };

    checkValidFormIndexZero = () => {
      const fields = this.props[metaInfo.store][metaInfo.form].fields.content[0];
      return (fields.title.value && fields.contentType.value && fields.scope.value);
    };

    addMore = () => {
      if (this.checkValidFormIndexZero()) {
        this.props[metaInfo.store].addMore(metaInfo.form, 'content');
      }
      this.toggleModal(true);
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
      const docs = [...this.props[metaInfo.store][metaInfo.form].fields.content];
      this.props[metaInfo.store].reOrderHandle(arrayMove(docs, oldIndex, newIndex), metaInfo.form, 'content');
      this.props[metaInfo.store].setFieldValue('onDragSaveEnable', true);
    };

    render() {
      const { match } = this.props;
      const form = this.props[metaInfo.store][metaInfo.form];
      // eslint-disable-next-line no-shadow
      // const { NewContentModal, CollectionContent } = this.props;
      const navItems = [];
      form.fields.content.map((content, index) => {
        navItems.push({ title: `${content.title.value !== '' ? content.title.value : `Content Block ${index + 1}`}`, to: `${index + 1}`, index });
        return navItems;
      });
      return (
        <WrappedComponent>
          <div className="inner-content-spacer">
            {this.stateopenModal && <NewContentModal refLink={match.url} toggleModal={this.toggleModal} index={form.fields.content.length - 1} />}
            <Grid>
              <Grid.Column widescreen={4} computer={4} tablet={3} mobile={16}>
                <div className="sticky-sidebar">
                  <DraggableMenu secondary vertical match={match} onSortEnd={this.onSortEnd} navItems={navItems} />
                  {form.fields.content.length < 15
                    && <Button size="small" color="blue" className="link-button mt-20" onClick={this.addMore}>+ Add another content block</Button>}
                </div>
              </Grid.Column>
              <Grid.Column widescreen={12} computer={12} tablet={13} mobile={16}>
                <Switch>
                  <Route exact path={match.url} render={renderProps => <CollectionContent refLink={match.url} {...renderProps} index={0} />} />
                  {navItems.map(item => (<Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={renderProps => <CollectionContent refLink={match.url} {...renderProps} index={item.index || 0} />} />))}
                </Switch>
              </Grid.Column>
            </Grid>
          </div>
        </WrappedComponent>
      );
    }
  })));
}

export default observer(ContentHOC);
