import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import { ARTICLE_STATUS_VALUES } from '../../../../../services/constants/admin/article';
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
  search = (e, name) => {
    this.props.articleStore.setInitiateSrch(name, e.target.value);
  }
  toggleSearch = () => this.props.articleStore.toggleSearch();
  render() {
    const { match } = this.props;
    const {
      filters,
      requestState,
      categoriesDropdown,
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
            change={e => this.search(e, 'title')}
            addon={
              <Grid.Column width={3} textAlign="right">
                <Button color="green" as={Link} floated="right" to={`${match.url}/new`}>
                Add new article
                </Button>
              </Grid.Column>
            }
            toggleSearch={this.toggleSearch}
            filters={filters}
            requestState={requestState}
            more="no"
          />
        }
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.categoryId} change={this.setSearchParam} name="Category" keyName="categoryId" options={categoriesDropdown} />
                  </Grid.Column>
                  <Grid.Column>
                    <Search
                      {...this.props}
                      w={[4]}
                      placeholder="Search by Tags"
                      executeSearch={e => this.search(e, 'tags')}
                      filters={filters}
                      fLabel="Tags"
                      showLabel
                      more="no"
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.articleStatus} change={this.setSearchParam} name="Status" keyName="articleStatus" options={ARTICLE_STATUS_VALUES} />
                  </Grid.Column>
                  <Grid.Column>
                    <Search
                      {...this.props}
                      w={[4]}
                      fLabel="Author"
                      placeholder="Search by Author"
                      executeSearch={e => this.search(e, 'author')}
                      filters={filters}
                      more="no"
                      showLabel
                    />
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <DateRangeFilter
                      change={maskChange}
                      label="Date Range"
                      name="dateRange"
                    />
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
