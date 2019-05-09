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
    this.props.articleStore.getCategoryListByTypes(false, ['INV_FAQ', 'ISSUER_FAQ']);
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
            w={[9]}
            placeholder="Search by keyword or phrase"
            executeSearch={this.search}
            addon={
              <Grid.Column width={7} textAlign="right">
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
            more="no"
          />}
      >
        <AllFaqs match={match} {...this.props} />
      </PrivateLayout>
    );
  }
}
