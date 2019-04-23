import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import { ByKeyword as Search, DropdownFilter } from '../../../../../theme/form/Filters';

import { ARTICLE_STATUS_VALUES, AUTHORS } from '../../../../../services/constants/admin/article';

import AllKnowledgeBaseItems from './../components/AllKnowledgeBaseItems';

@inject('knowledgeBaseStore')
@observer
export default class ManageKnowledgeBase extends Component {
  componentWillMount() {
    this.props.knowledgeBaseStore.getCategoryList(false);
  }
  setSearchParam = (e, { name, value }) => {
    this.props.knowledgeBaseStore.setInitiateSrch(name, value);
  }
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.knowledgeBaseStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  removeFilter = name => this.props.userListingStore.removeFilter(name);
  toggleSearch = () => this.props.knowledgeBaseStore.toggleSearch();
  render() {
    const { match } = this.props;
    const {
      filters,
      requestState,
      categoriesDropdown,
    } = this.props.knowledgeBaseStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={
          <Search
            {...this.props}
            w={[10]}
            placeholder="Search by keyword or phrase"
            addon={
              <Grid.Column width={3} textAlign="right">
                <Button color="green" as={Link} floated="right" to={`${match.url}/new`}>
                  Add new article
                </Button>
              </Grid.Column>
            }
            executeSearch={this.executeSearch}
            toggleSearch={this.toggleSearch}
            filters={filters}
            setSearchParam={this.setSearchParam}
            removeFilter={this.removeFilter}
            requestState={requestState}
          />
        }
        P2={
          <div className={`more search-filters ${filters ? '' : 'collapsed'}`}>
            <Form>
              <Grid stackable columns="equal">
                <Grid.Row>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.categoryId} change={this.setSearchParam} name="Category" keyName="categoryId" options={categoriesDropdown} isMultiple />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.itemStatus} change={this.setSearchParam} name="Status" keyName="itemStatus" options={ARTICLE_STATUS_VALUES} />
                  </Grid.Column>
                  <Grid.Column>
                    <DropdownFilter value={requestState.search.authorId} change={this.setSearchParam} name="Author" keyName="authorId" options={AUTHORS} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </div>
        }
      >
        <AllKnowledgeBaseItems match={match} />
      </PrivateLayout>
    );
  }
}
