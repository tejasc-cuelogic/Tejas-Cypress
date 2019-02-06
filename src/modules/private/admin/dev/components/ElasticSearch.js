import React, { Component } from 'react';
import { Grid, Card, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

// const elasticSearchModules = [
//   {
//     module: 'users',
//     title: 'Users Index',
//     cta: [
//       { title: 'Create', color: 'green', mutation: 'userCreateIndices' },
//       { title: 'Generate', color: 'blue', mutation: 'userPopulateIndex' },
//       { title: 'Update', color: 'blue', mutation: 'userPopulateIndex' },
//       { title: 'Delete', color: 'red', mutation: 'userDeleteIndices' },
//     ],
//   },
//   {
//     module: 'crowdPay',
//     title: 'CrowdPay Index',
//     cta: [
//       { title: 'Create', color: 'green', mutation: 'crowdPayCreateIndices' },
//       { title: 'Generate', color: 'blue', mutation: 'crowdPayPopulateIndex' },
//       { title: 'Update', color: 'blue', mutation: 'crowdPayPopulateIndex' },
//       { title: 'Delete', color: 'red', mutation: 'crowdPayDeleteIndices' },
//     ],
//   },
//   {
//     module: 'accreditation',
//     title: 'Accreditation Index',
//     cta: [
//       { title: 'Create', color: 'green', mutation: 'accreditationCreateIndices' },
//       { title: 'Generate', color: 'blue', mutation: 'accreditationPopulateIndex' },
//       { title: 'Update', color: 'blue', mutation: 'accreditationPopulateIndex' },
//       { title: 'Delete', color: 'red', mutation: 'accreditationDeleteIndices' },
//     ],
//   },
//   {
//     module: 'linkedBank',
//     title: 'LinkedBank Index',
//     cta: [
//       { title: 'Create', color: 'green', mutation: 'linkedBankCreateIndices' },
//       { title: 'Generate', color: 'blue', mutation: 'linkedBankPopulateIndex' },
//       { title: 'Update', color: 'blue', mutation: 'linkedBankPopulateIndex' },
//       { title: 'Delete', color: 'red', mutation: 'linkedBankDeleteIndices' },
//     ],
//   },
// ];

@inject('elasticSearchStore')
@withRouter
@observer
export default class ElasticSearch extends Component {
  componentWillMount() {
    // if (this.props.match.isExact) {
    //   this.props.accreditationStore.initRequest();
    // }
  }
  render() {
    const { match } = this.props;
    const navItems = [
      { title: 'Activity History', to: 'activity-history' },
    ];
    return (
      <Grid>
        <Grid.Column width={4}>
          <Card fluid>
            <Card.Content header="Users Index" />
            <Card.Content>
              <Card.Description>
                <Button.Group widths={2} className="elastic-search">
                  <Button content="Create" primary />
                  <Button content="Generate" secondary />
                  <Button content="Update" primary />
                  <Button content="Delete" color="red" />
                </Button.Group>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={12}>
          <div className="sticky-sidebar">
            <Card fluid>
              <SecondaryMenu match={match} navItems={navItems} />
              <ActivityHistory />
            </Card>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}
