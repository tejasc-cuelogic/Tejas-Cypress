import React, { Component } from 'react';
import { mapValues } from 'lodash';
import { inject, observer } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, Switch, Link } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import PrivateLayout from '../../shared/PrivateLayout';
import { InlineLoader, NsPagination } from '../../../../theme/shared';
import { ByKeyword } from '../../../../theme/form/Filters';
import { DataFormatter } from '../../../../helper';

const getModule = component => Loadable({
  loader: () => import(`./containers/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('uiStore', 'navStore', 'offeringsStore')
@observer
export default class Offerings extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/overview`);
    }
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.offeringsStore.setInitiateSrch('keyword', e.target.value);
    }
  }

  toggleSearch = () => this.props.offeringsStore.toggleSearch();

  module = name => DataFormatter.upperCamelCase(name);

  representAddon = subTabs => mapValues(subTabs, t => (
    ` (${t})`
  ));

  render() {
    const { match } = this.props;
    const navItems = this.props.navStore.navMeta.subNavigations;
    const {
      subTabs,
      filters,
      requestState,
      totalRecords,
    } = this.props.offeringsStore;
    return (
      <PrivateLayout
        {...this.props}
        subNav
        subNavAddon={{ data: this.representAddon(subTabs) }}
        P1={
          <ByKeyword
            executeSearch={this.executeSearch}
            w={[8]}
            placeholder="Search by keyword or phrase"
            toggleSearch={this.toggleSearch}
            requestState={requestState}
            filters={filters}
            more="no"
            addon={
              <Grid.Row>
                <Grid.Column width={6} textAlign="right">
                  {totalRecords > 0 &&
                  <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
                  }
                </Grid.Column>
                <Grid.Column width={5} textAlign="right">
                  <Button color="green" as={Link} floated="right" to={this.props.match.url}>
                    Export
                  </Button>
                </Grid.Column>
              </Grid.Row>
            }
          />
        }
      >
        <Switch>
          <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
          {
            navItems.map(item => (
              <Route
                key={item.to}
                path={`${match.url}/${item.to}`}
                component={getModule(this.module(item.title))}
              />
            ))
          }
        </Switch>
      </PrivateLayout>
    );
  }
}
