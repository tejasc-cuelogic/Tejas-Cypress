import React, { Component } from 'react';
import { Grid, Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../../shared/PrivateLayout';
import { ByKeyword as Search, DropdownFilter } from '../../../../../theme/form/Filters';
import AllFaqs from '../components/AllFaqs';
import { FAQ_STATUS_VALUES, FAQ_TYPES_VALUES } from '../../../../../services/constants/admin/faqs';

@inject('faqStore', 'articleStore')
@observer
export default class ManageFaqs extends Component {
  componentWillMount() {
    this.props.articleStore.getCategoryList(false);
  }
  search = (e) => {
    if (e.charCode === 13 && false) {
      // search goes here..
    }
  }
  toggleSearch = () => this.props.articleStore.toggleSearch();
  render() {
    const {
      match,
      filters,
    } = this.props;
    const { categoriesDropdown } = this.props.articleStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={
          <Search
            {...this.props}
            w={[8]}
            placeholder="Search by keyword or phrase"
            executeSearch={this.search}
            addon={
              <Grid.Column width={5} textAlign="right">
                <Button color="basic" as={Link} to={`${match.url}/new`}>
                  Add FAQ
                </Button>
                <Button color="green" as={Link} to={`${match.url}/new`}>
                  Manage categories
                </Button>
              </Grid.Column>
            }
            change={this.setSearchParam}
            toggleSearch={this.toggleSearch}
            filters={filters}
          />}
        P2={
          <div className="more search-filters">
            <Form>
              <Grid stackable columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <DropdownFilter width={1} change={this.setSearchParam} name="Type" keyName="type" options={FAQ_TYPES_VALUES} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter width={1} change={this.setSearchParam} name="Category" keyName="categoryName" options={categoriesDropdown} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter width={1} change={this.setSearchParam} name="Status" keyName="status" options={FAQ_STATUS_VALUES} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </div>
        }
      >
        <AllFaqs match={match} {...this.props} />
      </PrivateLayout>
    );
  }
}
