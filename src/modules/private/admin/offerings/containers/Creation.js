import React, { Component } from 'react';
import Aux from 'react-aux';
import moment from 'moment';
import { startCase, lowerCase, kebabCase } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Confirm, Icon } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import { InlineLoader } from './../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';
import Helper from '../../../../../helper/utility';
import OfferingDetails from '../components/creation/OfferingDetails';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};
@inject('offeringsStore', 'uiStore')
@observer
export default class Creation extends Component {
  handleAction = (action, offeringId) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offeringId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/edit/${offeringId}`);
    }
  }

  handleDeleteOffering = () => {
    const { offeringsStore, uiStore } = this.props;
    offeringsStore.deleteOffering(uiStore.confirmBox.refId);
    this.props.uiStore.setConfirmBox('');
  }

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { offeringsStore, match } = this.props;
    const {
      offerings,
      loading,
    } = offeringsStore;
    const { confirmBox } = this.props.uiStore;

    if (loading) {
      return <InlineLoader />;
    }

    return (
      <Aux>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable className="application-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Created Date</Table.HeaderCell>
                  <Table.HeaderCell>Days till launch</Table.HeaderCell>
                  <Table.HeaderCell>Lead</Table.HeaderCell>
                  <Table.HeaderCell>POC</Table.HeaderCell>
                  <Table.HeaderCell textAlign="center" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  offerings.map(offering => (
                    <Table.Row key={offering.id}>
                      <Table.Cell>
                        <b>{offering.campaignName}</b>
                      </Table.Cell>
                      <Table.Cell className={`status ${kebabCase(startCase(lowerCase(offering.status)))}`} >{startCase(lowerCase(offering.status))}</Table.Cell>
                      <Table.Cell>{moment(offering.createdAt).format('M/DD/YYYY')}</Table.Cell>
                      <Table.Cell>
                        {DataFormatter.datesDifferenceInDays(offering.launchedDate)} days
                      </Table.Cell>
                      <Table.Cell>{offering.lead}</Table.Cell>
                      <Table.Cell>
                        <p>
                          <b>{offering.pocName}</b><br />
                          {offering.pocEmail}<br />
                          {Helper.maskPhoneNumber(offering.pocPhone)}
                        </p>
                      </Table.Cell>
                      <Table.Cell collapsing textAlign="center">
                        {Object.keys(actions).map(action => (
                          <Button.Group vertical>
                            <Button className="link-button" >
                              <Icon className={`ns-${actions[action].icon}`} onClick={() => this.handleAction(actions[action].label, offering.id)} />
                            </Button>
                          </Button.Group>
                      ))}
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
        </Card>
        <Route path={`${match.url}/edit/:offeringid`} render={props => <OfferingDetails refLink={match.url} {...props} />} />
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this offering?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
