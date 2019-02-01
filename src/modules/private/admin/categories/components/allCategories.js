import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
// import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import Aux from 'react-aux';
import { Accordion, Table, Icon, Button, Confirm } from 'semantic-ui-react';
import { InlineLoader } from './../../../../../theme/shared';

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
  render() {
    const { activeIndex } = this.state;
    const { loading } = this.props.categoryStore;
    const { confirmBox } = this.props.uiStore;
    if (loading) {
      return <InlineLoader />;
    }
    const categories = this.props.categoryStore.getAllCategoriesData;
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
              <div className="table-wrapper">
                <Table unstackable basic className="form-table categories-table">
                  <Table.Body>
                    {
                      category.categories && category.categories.length ?
                      category.categories.map(cat => (
                        <Table.Row>
                          <Table.Cell>
                            <Icon className="ns-drag-holder-large mr-10" />
                            {cat.categoryName}
                          </Table.Cell>
                          <Table.Cell collapsing>
                            <Button onClick={() => this.openModal(cat.id, category.title, cat.categoryType, index)} className="link-button">
                              <Icon name="ns-pencil" />
                            </Button>
                            <Button className="link-button">
                              <Icon onClick={() => this.publishStatus(cat.id, cat.isPublished)} color="blue" name={cat.isPublished ? 'ns-view' : 'ns-no-view'} />
                            </Button>
                            <Button className="link-button">
                              <Icon name="ns-trash" onClick={() => this.handleDeleteConfirm(cat.id)} />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      )) : <Table.Row> No Category To Display! </Table.Row>
                    }
                  </Table.Body>
                </Table>
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
