/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { SortableContainer, SortableElement, sortableHandle, arrayMove } from 'react-sortable-hoc';
import Aux from 'react-aux';
import { Accordion, Icon, Button, Confirm } from 'semantic-ui-react';
import { InlineLoader } from './../../../../../theme/shared';

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);

const SortableItem = SortableElement(({
  cat, openModal, publishStatus, handleDeleteConfirm, category, categoryTypeIndex,
}) => (
  <div className="row-wrap">
    <div>
      <DragHandle />
      <a onClick={() => openModal(cat.id, category.title, cat.categoryType, categoryTypeIndex)}>
        {cat.categoryName}
      </a>
    </div>
    <div className="action">
      <Button onClick={() => openModal(cat.id, category.title, cat.categoryType, categoryTypeIndex)} className="link-button">
        <Icon name="ns-pencil" />
      </Button>
      <Button className="link-button">
        <Icon onClick={() => publishStatus(cat.id, cat.isPublished)} color="blue" name={cat.isPublished ? 'ns-view' : 'ns-no-view'} />
      </Button>
      <Button className="link-button">
        <Icon name="ns-trash" onClick={() => handleDeleteConfirm(cat.id)} />
      </Button>
    </div>
  </div>
));

const SortableList = SortableContainer(({
  docs, openModal, handleDeleteConfirm, category, publishStatus, categoryTypeIndex,
}) => (
  <div>
    {docs.map((doc, index) => (
      <SortableItem
        key={`item-${index}`}
        categoryTypeIndex={categoryTypeIndex}
        cat={doc}
        publishStatus={publishStatus}
        openModal={openModal}
        handleDeleteConfirm={handleDeleteConfirm}
        category={category}
        index={index}
      />
    ))}
  </div>
));
@inject('uiStore', 'categoryStore')
@withRouter
@observer
export default class AllCategories extends Component {
  state = { activeIndex: 0 }
  componentWillMount() {
    if (this.props.categoryStore.ifApiHitFirstTime) {
      this.props.categoryStore.initRequest();
      this.props.categoryStore.ifApiHitFirstTime = false;
    } else {
      this.toggleAccordianContent();
    }
  }
  onSortEnd = ({ oldIndex, newIndex }, index) => {
    const { allCategoriesData, setCategoryOrder } = this.props.categoryStore;
    const categories = allCategoriesData;
    if (oldIndex !== newIndex) {
      setCategoryOrder(arrayMove(categories[index].categories, oldIndex, newIndex), index);
    }
  }
  openModal = (id, title, type, index) => {
    this.props.categoryStore.setFieldValue('selectedCategoryState', { title, type, index });
    this.props.history.push(`${this.props.match.url}/${id}`);
  }
  handleDeleteConfirm = (id) => {
    this.props.uiStore.setConfirmBox('Delete', id);
  }
  handleDelete = () => {
    this.props.categoryStore.deleteCategory(this.props.uiStore.confirmBox.refId);
    this.props.uiStore.setConfirmBox('');
  }
  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  publishStatus = (id, isPublished) => {
    const { saveCategories } = this.props.categoryStore;
    saveCategories(id, isPublished);
  }
  toggleAccordianContent = (categoryIndex = null) => {
    let index = categoryIndex;
    if (categoryIndex === null) {
      const { currentCategoryIndex } = this.props.categoryStore;
      if (currentCategoryIndex !== null) {
        index = currentCategoryIndex;
      }
      this.state.activeIndex = index === 0 ? -1 : this.state.activeIndex;
    }
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }
  render() {
    const { activeIndex } = this.state;
    const { loading } = this.props.categoryStore;
    const { confirmBox } = this.props.uiStore;
    if (loading) {
      return <InlineLoader />;
    }
    const categories = this.props.categoryStore.allCategoriesData;
    if (categories.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <Aux>
        {categories && categories.length && categories.map((category, index) => (
          <Accordion fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordianContent(index)} className="text-capitalize">
              <Icon className={activeIndex === index ? 'ns-chevron-up' : 'ns-chevron-down'} />
              {category.title} <small>{category.categories.length} elements</small>
              <Button onClick={() => this.openModal('new', category.title, category.type, index)} className="link-button pull-right"><small>+ Add Category</small></Button>
            </Accordion.Title>
            <Accordion.Content active={activeIndex === index} className="categories-acc">
              <div className="ui basic compact table form-table categories-table">
                <SortableList
                  docs={category.categories}
                  pressDelay={100}
                  categoryTypeIndex={index}
                  onSortEnd={e => this.onSortEnd(e, index)}
                  openModal={this.openModal}
                  publishStatus={this.publishStatus}
                  handleDeleteConfirm={this.handleDeleteConfirm}
                  lockAxis="y"
                  category={category}
                  useDragHandle
                />
              </div>
            </Accordion.Content>
          </Accordion>
        ))}
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this Category?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDelete}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
