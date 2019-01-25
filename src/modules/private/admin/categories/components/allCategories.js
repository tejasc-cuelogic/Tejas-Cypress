import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Accordion, Table, Icon, Button } from 'semantic-ui-react';
import { InlineLoader } from './../../../../../theme/shared';

@inject('categoryStore')
@withRouter
@observer
export default class AllCategories extends Component {
  componentWillMount() {
    this.props.categoryStore.initRequest();
  }

  openModal = (index, title, type) => {
    this.props.categoryStore.setFieldValue('selectedCategoryState', { title, type });
    this.props.history.push(`${this.props.match.url}/${index}`);
  }
  handleDelete = (id) => {
    this.props.categoryStore.deleteCategory(id);
  }
  render() {
    const { loading } = this.props.categoryStore;
    if (loading) {
      return <InlineLoader />;
    }
    const categories = this.props.categoryStore.getAllCategoriesData;
    if (categories.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <Aux>
        {categories && categories.map(category => (
          <Accordion fluid styled className="card-style">
            <Accordion.Title active={category.categories.length > 0} className="text-capitalize">
              <Icon className="ns-chevron-up" />
              {category.title} <small>{category.categories.length} elements</small>
              <Button onClick={() => this.openModal('new', category.title, category.categories[0].categoryType)} className="link-button pull-right"><small>+ Add Category</small></Button>
            </Accordion.Title>
            <Accordion.Content active={category.categories.length > 0} className="categories-acc">
              <div className="table-wrapper">
                <Table unstackable basic className="form-table categories-table">
                  <Table.Body>
                    {
                      category.categories && category.categories.map(cat => (
                        <Table.Row>
                          <Table.Cell>
                            <Icon className="ns-drag-holder-large mr-10" />
                            {cat.categoryName}
                          </Table.Cell>
                          <Table.Cell collapsing>
                            <Button onClick={() => this.openModal(cat.id, category.title, cat.categoryType)} className="link-button">
                              <Icon name="ns-pencil" />
                            </Button>
                            <Button className="link-button">
                              <Icon color="blue" name="ns-no-view" />
                            </Button>
                            <Button className="link-button">
                              <Icon name="ns-trash" onClick={() => this.handleDelete(cat.id)} />
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    }
                  </Table.Body>
                </Table>
              </div>
            </Accordion.Content>
          </Accordion>
        ))}
      </Aux>
    );
  }
}
