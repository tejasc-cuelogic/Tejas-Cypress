import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import PrivateLayout from '../../../shared/PrivateLayout';
import { ByKeyword as Search } from '../../../../../theme/form/Filters';
import AllFaqs from '../components/AllFaqs';

@inject('faqStore', 'articleStore')
@observer
export default class ManageFaqs extends Component {
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
    return (
      <PrivateLayout
        refMatch={this.props.refMatch}
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
