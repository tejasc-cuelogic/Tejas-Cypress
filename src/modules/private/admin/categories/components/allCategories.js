import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { Accordion, Table, Icon, Button } from 'semantic-ui-react';
import AddNewCategory from './addNewCategoryModal';
import { InlineLoader } from './../../../../../theme/shared';

@inject('categoryStore')
@observer
@withRouter

export default class AllCategories extends Component {
  // state = {
  //   showModal: false,
  //   modalIndex: 0,
  // }
  componentWillMount() {
    this.props.categoryStore.initRequest('INV_FAQ');
    console.log(this.props);
  }

  addCategory = () => {
    console.log('Category has been added');
    const { saveCategories } = this.props.categoryStore;
    saveCategories();
    this.closeModal();
  }
  openModal = (index) => {
    this.props.history.push(`${this.props.match.url}/${index}`);
  //   this.setState({ showModal: true });
  //   this.setState({ modalIndex: index });
  // }
  // closeModal = () => {
  //   this.setState({ showModal: false });
  //   this.setState({ modalIndex: 0 });
  }
  render() {
    const { loading } = this.props.categoryStore;
    if (loading) {
      return <InlineLoader />;
    }
    const categories = this.props.categoryStore.getAllCategoriesData();
    if (categories.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <Aux>
        {categories && categories.map(category => (
          <Accordion fluid styled className="card-style">
            <Accordion.Title active={category.questions.length > 0} className="text-capitalize">
              <Icon className="ns-chevron-up" />
              {category.title} <small>{category.questions.length} elements</small>
              {/* <Link onClick={() => this.openModal(null)}
            to={this.props.match.url} className="link pull-right"><small>+
            Add Category</small></Link> */}
              <Button onClick={() => this.openModal('new')} className="link-button pull-right"><small>+ Add Category</small></Button>
            </Accordion.Title>
            <Accordion.Content active={category.questions.length > 0} className="categories-acc">
              <div className="table-wrapper">
                <Table unstackable basic className="form-table categories-table">
                  <Table.Body>
                    {
                      category.questions && category.questions.map(question => (
                        <Table.Row>
                          <Table.Cell>
                            <Icon className="ns-drag-holder-large mr-10" />
                            {question.categoryName}
                          </Table.Cell>
                          <Table.Cell collapsing>
                            {/* <Button className="link-button"> */}
                            <Button onClick={() => this.openModal(question.id)} className="link-button">
                              <Icon name="ns-pencil" />
                            </Button>
                            <Button className="link-button">
                              <Icon color="blue" name="ns-no-view" />
                            </Button>
                            <Button className="link-button">
                              <Icon name="ns-trash" />
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

        <Switch>
          <Route exact path={`${this.props.match.url}/:id`} component={AddNewCategory} />
        </Switch>

      </Aux>
    );
  }
}
