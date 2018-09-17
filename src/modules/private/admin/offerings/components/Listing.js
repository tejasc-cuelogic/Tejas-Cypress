import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Icon, Confirm } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';
import { DateTimeFormat, InlineLoader } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
};

@inject('uiStore', 'offeringsStore')
@withRouter
@observer
export default class Listing extends Component {
  handleAction = (action, offeringId) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offeringId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/edit/${offeringId}`);
    }
  }
  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handleDeleteOffering = () => {
    const { offeringsStore, uiStore } = this.props;
    offeringsStore.deleteOffering(uiStore.confirmBox.refId);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const { offerings, loading, uiStore } = this.props;
    const { confirmBox } = uiStore;

    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Created Date</Table.HeaderCell>
                <Table.HeaderCell>Days till launch</Table.HeaderCell>
                <Table.HeaderCell>Lead</Table.HeaderCell>
                <Table.HeaderCell>POC</Table.HeaderCell>
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {offerings.length === 0 ? (
                <Table.Row><Table.Cell colSpan={6} textAlign="center">No Offering to display !</Table.Cell></Table.Row>
                ) :
                offerings.map(offering => (
                  <Table.Row key={offering.id}>
                    <Table.Cell>
                      <b>{offering.keyTerms.legalBusinessName}</b>
                    </Table.Cell>
                    <Table.Cell><DateTimeFormat datetime={offering.created.date} /></Table.Cell>
                    <Table.Cell>
                      {DataFormatter.diffDays(offering.offering.launch.targetDate)} days
                    </Table.Cell>
                    <Table.Cell>{offering.lead.name}</Table.Cell>
                    <Table.Cell>
                      <p>
                        <b>pocname11</b><br />
                        pocemail11@test.com<br />
                        {Helper.maskPhoneNumber('123-456-7890')}
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
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this offering?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />

      </Card>
    );
  }
}
