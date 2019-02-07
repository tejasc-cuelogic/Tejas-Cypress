import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import { CATEGORY_VALUES, TAGS, ARTICLE_STATUS_VALUES, AUTHORS } from '../../../../../services/constants/admin/article';
import { ByKeyword as Search, DropdownFilter, DateRangeFilter } from '../../../../../theme/form/Filters';
import AllInsights from '../components/AllInsights';

@inject('articleStore')
@observer
export default class ManageInsights extends Component {
  componentWillMount() {
    this.props.articleStore.getCategoryList(false);
  }
  setSearchParam = (e, { name, value }) =>
    this.props.articleStore.setInitiateSrch(name, value);
  search = (e) => {
    if (e.charCode === 13 && false) {
      // search goes here..
    }
  }
  toggleSearch = () => this.props.articleStore.toggleSearch();
  render() {
    const { match } = this.props;
    const {
      filters,
      requestState,
      maskChange,
    } = this.props.articleStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={
          <Search
            {...this.props}
            w={[10]}
            placeholder="Search by keyword or phrase"
            executeSearch={this.search}
            addon={
              <Grid.Column width={3} textAlign="right">
                <Button color="green" as={Link} floated="right" to={`${match.url}/new`}>
                Add new article
                </Button>
              </Grid.Column>
            }
            change={this.setSearchParam}
            toggleSearch={this.toggleSearch}
            filters={filters}
          />
        }
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.categoryName} change={this.setSearchParam} name="Category" keyName="categoryName" options={CATEGORY_VALUES} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.tags} change={this.setSearchParam} name="Tags" keyName="tags" options={TAGS} isMultiple />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.status} change={this.setSearchParam} name="Status" keyName="status" options={ARTICLE_STATUS_VALUES} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.author} change={this.setSearchParam} name="Author" keyName="author" options={AUTHORS} />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <DateRangeFilter change={maskChange} label="Date Range" name="dateRange" />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </div>
        }
      >
        <AllInsights match={match} />
      </PrivateLayout>
    );
  }
}
