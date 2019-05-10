import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PrivateLayout from '../../../shared/PrivateLayout';
import { ByKeyword as Search } from '../../../../../theme/form/Filters';
import AllKnowledgeBaseItems from './../components/AllKnowledgeBaseItems';

@inject('knowledgeBaseStore')
@observer
export default class ManageKnowledgeBase extends Component {
  onFilterChange = (e) => {
    this.props.knowledgeBaseStore.setSearchFilters(e.target.name, e.target.value);
  }

  setSearchParam = (e, { name, value }) => {
    this.props.knowledgeBaseStore.setInitiateSrch(name, value);
  }
  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.knowledgeBaseStore.setInitiateSrch('keyword', e.target.value);
    }
  }
  searchByAuthor = (e) => {
    if (e.charCode === 13) {
      this.props.knowledgeBaseStore.setInitiateSrch('authorName', e.target.value);
    }
  }

  removeFilter = name => this.props.userListingStore.removeFilter(name);
  toggleSearch = () => this.props.knowledgeBaseStore.toggleSearch();
  render() {
    const { match } = this.props;
    const {
      filters,
      requestState,
    } = this.props.knowledgeBaseStore;
    return (
      <PrivateLayout
        {...this.props}
        P1={
          <Search
            {...this.props}
            name="keyword"
            w={[10]}
            placeholder="Search by keyword or phrase"
            addon={
              <Grid.Column width={6} textAlign="right">
                <Button color="green" as={Link} floated="right" to={`${match.url}/new/DRAFT`}>
                  Add Knowledge Base
                </Button>
              </Grid.Column>
            }
            executeSearch={this.executeSearch}
            toggleSearch={this.toggleSearch}
            filters={filters}
            setSearchParam={this.setSearchParam}
            removeFilter={this.removeFilter}
            requestState={requestState}
            change={e => this.onFilterChange(e)}
            more="no"
          />
        }
      >
        <AllKnowledgeBaseItems match={match} />
      </PrivateLayout>
    );
  }
}
