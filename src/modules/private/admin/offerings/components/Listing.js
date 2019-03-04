import React, { Component } from 'react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Icon, Confirm } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';
import { DateTimeFormat, InlineLoader, NsPagination } from '../../../../../theme/shared';
import { STAGES } from '../../../../../services/constants/admin/offerings';
import Helper from '../../../../../helper/utility';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};

@inject('uiStore', 'offeringsStore')
@withRouter
@observer
export default class Listing extends Component {
  state = { isPublic: false };
  componentWillMount() {
    this.props.offeringsStore.resetInitLoad();
  }
  handleAction = (action, offeringId, isPublished = false) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offeringId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/edit/${offeringId}`);
    } else if (action === 'Publish') {
      this.setState({ isPublic: isPublished });
      this.props.uiStore.setConfirmBox(action, offeringId, isPublished);
    }
  }
  paginate = params => this.props.offeringsStore.pageRequest(params);

  handleDeleteCancel = () => {
    this.props.uiStore.setConfirmBox('');
  }
  handlePublishOffering = () => {
    const { offeringsStore, uiStore } = this.props;
    offeringsStore.updateOfferingPublicaly(uiStore.confirmBox.refId, uiStore.confirmBox.subRefId);
    this.props.uiStore.setConfirmBox('');
  }
  handleDeleteOffering = () => {
    const { offeringsStore, uiStore } = this.props;
    offeringsStore.deleteOffering(uiStore.confirmBox.refId);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const {
      uiStore, offeringsStore,
    } = this.props;
    const {
      offerings,
      loading,
      count,
      requestState,
    } = offeringsStore;
    const { confirmBox } = uiStore;
    const totalRecords = count || 0;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Card fluid>
        <div className="table-wrapper">
          <Table unstackable className="application-list clickable">
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
              {offerings.length === 0 ? (
                <Table.Row><Table.Cell colSpan={6} textAlign="center">No Offering to display !</Table.Cell></Table.Row>
                ) :
                offerings.map(offering => (
                  <Table.Row key={offering.id}>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                      <b>{((offering.keyTerms && offering.keyTerms.shorthandBusinessName) ?
                          offering.keyTerms.shorthandBusinessName : (
                          (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
                        ))}
                      </b>
                    </Table.Cell>
                    <Table.Cell className="text-capitalize">
                      {offering && offering.stage ?
                        STAGES[offering.stage].label : '-'
                      }
                    </Table.Cell>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}><DateTimeFormat datetime={offering.created.date} /></Table.Cell>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                      {offering.offering && offering.offering.launch &&
                      offering.offering.launch.terminationDate ?
                      `${DataFormatter.diffDays(offering.offering.launch.terminationDate)} days` : 'N/A'
                      }
                    </Table.Cell>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>{offering.leadDetails && offering.leadDetails.info ? `${offering.leadDetails.info.firstName} ${offering.leadDetails.info.lastName}` : 'N/A'}</Table.Cell>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                      <p>
                        {offering.issuerDetails ?
                          <Aux>
                            <b>
                              {offering.issuerDetails && offering.issuerDetails.info ? `${offering.issuerDetails.info.firstName} ${offering.issuerDetails.info.lastName}` : ''}
                            </b>
                            <br />
                            {get(offering, 'issuerDetails.email.address') ? offering.issuerDetails.email.address : ''}
                            <br />
                            {get(offering, 'issuerDetails.phone.number') ? Helper.maskPhoneNumber(get(offering, 'issuerDetails.phone.number')) : ''}
                          </Aux> :
                          <b>N/A</b>
                        }
                      </p>
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="center">
                      <Button.Group>
                        {Object.keys(actions).map(action => (
                          <Button icon className="link-button" >
                            <Icon className={`ns-${actions[action].label === 'Publish' ? offering.isAvailablePublicly ? actions[action].icon : actions[action].icon1 : actions[action].icon}`} onClick={() => this.handleAction(actions[action].label, offering.id, !offering.isAvailablePublicly)} />
                          </Button>
                        ))}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        {totalRecords > 0 &&
          <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
        }
        <Confirm
          header="Confirm"
          content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${this.state.isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
          open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
          onCancel={this.handleDeleteCancel}
          onConfirm={confirmBox.entity === 'Publish' ? this.handlePublishOffering : this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />

      </Card>
    );
  }
}
