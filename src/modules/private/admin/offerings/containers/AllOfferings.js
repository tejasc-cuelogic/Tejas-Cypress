import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Button, Form } from 'semantic-ui-react';
import { ByKeyword } from '../../../../../theme/form/Filters';
import { DataFormatter } from '../../../../../helper';
import Listing from '../components/Listing';
import DraggableListing from '../components/DraggableListing';
import AllLiveOfferings from '../components/allLiveOfferings';
import { REACT_APP_DEPLOY_ENV } from '../../../../../constants/common';

@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Offerings extends Component {
  constructor(props) {
    super(props);
    const {
      db, initRequest, setFieldValue, requestState,
    } = this.props.offeringsStore;
    const params = { stage: this.props.match.params.stage };
    if (!db[params.stage]) {
      initRequest(params);
    } else {
      setFieldValue('requestState', { ...requestState, ...params });
    }
  }

  componentWillUnmount() {
    const { setDb, allOfferingsList, requestState, orderedActiveListArr } = this.props.offeringsStore;
    if (allOfferingsList.length) {
      setDb(allOfferingsList);
    }
    if (requestState.stage === 'live') {
      orderedActiveListArr();
    }
  }

  executeSearch = (e) => {
    this.props.offeringsStore.setInitiateSrch('keyword', e.target.value);
  }

  toggleSearch = () => this.props.offeringsStore.toggleSearch();

  module = name => DataFormatter.upperCamelCase(name);

  paginate = params => this.props.offeringsStore.initRequest(params);

  render() {
    const { match } = this.props;
    const { stage } = this.props.match.params;
    const isDev = !['production', 'prod', 'master'].includes(REACT_APP_DEPLOY_ENV);

    const {
      filters,
      requestState,
    } = this.props.offeringsStore;
    const { inProgressArray } = this.props.uiStore;
    return (
      <div>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <ByKeyword
                change={this.executeSearch}
                w={[8]}
                placeholder="Search by keyword or phrase"
                toggleSearch={this.toggleSearch}
                requestState={requestState}
                filters={filters}
                more="no"
                addon={(
                  <>
                    <Grid.Column width={5} textAlign="right" floated="right">
                      <Button.Group floated="right">
                        {stage === 'creation'
                          && <Button color="green" as={Link} to={`${match.url}/new`} loading={inProgressArray.includes('upsert')} content="Create New Offering" />
                        }
                        {isDev
                          && <Button color="green" as={Link} to={match.url} className="relaxed" content="Export" />
                        }
                      </Button.Group>
                    </Grid.Column>
                  </>
                )}
              />
            </Grid.Row>
          </Grid>
        </Form>
        {['live'].includes(stage)
          ? <AllLiveOfferings stage={stage} />
          : !['completed'].includes(stage)
            ? <Listing stage={stage} noPagination={['creation'].includes(stage)} />
            : <DraggableListing stage={stage} />
        }
      </div>
    );
  }
}
