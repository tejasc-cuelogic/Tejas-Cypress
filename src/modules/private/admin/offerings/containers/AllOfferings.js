import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form } from 'semantic-ui-react';
import { NsPagination } from '../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { DataFormatter } from '../../../../../helper';
import Listing from '../components/Listing';


@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Offerings extends Component {
  componentWillMount() {
    const params = { first: 10, skip: 0, stage: this.props.match.params.stage };
    this.props.offeringsStore.initRequest(params);
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.offeringsStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  toggleSearch = () => this.props.offeringsStore.toggleSearch();

  module = name => DataFormatter.upperCamelCase(name);

  paginate = params => this.props.offeringsStore.initRequest(params);

  render() {
    const { match } = this.props;
    const { stage } = this.props.match.params;
    const {
      offerings,
      loading,
      filters,
      requestState,
      totalRecords,
    } = this.props.offeringsStore;
    return (
      <div>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                executeSearch={this.executeSearch}
                w={[8]}
                placeholder="Search by keyword or phrase"
                toggleSearch={this.toggleSearch}
                requestState={requestState}
                filters={filters}
                more="no"
                addon={
                  <Aux>
                    <Grid.Column width={3} textAlign="right">
                      {totalRecords > 0 &&
                      <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
                      }
                    </Grid.Column>
                    <Grid.Column width={5} textAlign="right">
                      <Button.Group floated="right">
                        {stage === 'creation' &&
                          <Button color="green" as={Link} to={`${match.url}/new`} content="Create New Offering" />
                        }
                        <Button color="green" as={Link} to={match.url} className="relaxed" content="Export" />
                      </Button.Group>
                    </Grid.Column>
                  </Aux>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Listing offerings={offerings} loading={loading} />
      </div>
    );
  }
}
