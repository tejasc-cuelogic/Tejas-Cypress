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
  onFilterChange = (e) => {
    this.props.faqStore.setInitiateSrch('keyword', e.target.value);
  }
  setSearchParam = (e, { name, value }) =>
    this.props.faqStore.setInitiateSrch(name, value);
  search = (e) => {
    if (e.charCode === 13) {
      this.props.faqStore.faqListByFilter();
    }
  }
  toggleSearch = () => this.props.faqStore.toggleSearch();
  render() {
    const { match } = this.props;
    const { categoriesDropdown } = this.props.articleStore;
    const { filters, requestState } = this.props.faqStore;
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
                <Button color="green" as={Link} to="/app/categories">
                  Manage categories
                </Button>
              </Grid.Column>
            }
            name="keyword"
            change={this.onFilterChange}
            toggleSearch={this.toggleSearch}
            filters={filters}
          />}
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <DropdownFilter keyword="type" value={requestState.search.type} width={1} change={this.setSearchParam} keyName="type" options={FAQ_TYPES_VALUES} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter keyword="categoryName" value={requestState.search.categoryName} width={1} change={this.setSearchParam} keyName="categoryName" options={categoriesDropdown} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter keyword="status" value={requestState.search.status} width={1} change={this.setSearchParam} keyName="status" options={FAQ_STATUS_VALUES} />
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
