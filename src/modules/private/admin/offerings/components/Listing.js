import React, { Component } from 'react';
import { get, includes } from 'lodash';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, Table, Button, Icon, Confirm } from 'semantic-ui-react';
import { DataFormatter } from '../../../../../helper';
import { DateTimeFormat, InlineLoader, NsPagination } from '../../../../../theme/shared';
import { STAGES } from '../../../../../services/constants/admin/offerings';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import Helper from '../../../../../helper/utility';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};

@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@withRouter
@observer
export default class Listing extends Component {
  state = { isPublic: false, loadingOfferId: '' };

  componentWillMount() {
    this.props.offeringCreationStore.setFieldValue('isListingPage', true);
    this.props.offeringsStore.resetInitLoad();
    this.props.offeringCreationStore.resetInitLoad();
    this.props.offeringsStore.resetPagination();
  }

  handleAction = (action, offeringId, isPublished = false) => {
    if (action === 'Delete') {
      this.props.uiStore.setConfirmBox(action, offeringId);
    } else if (action === 'Edit') {
      this.props.history.push(`${this.props.match.url}/edit/${offeringId}`);
    } else if (action === 'Publish') {
      this.setState({ isPublic: isPublished, loadingOfferId: offeringId });
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
    this.setState({ loadingOfferId: uiStore.confirmBox.refId });
    offeringsStore.deleteOffering(uiStore.confirmBox.refId);
    this.props.uiStore.setConfirmBox('');
  }

  render() {
    const {
      uiStore, offeringsStore, stage,
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
                {stage !== 'engagement'
                  ? (
                    <>
                      <Table.HeaderCell>Created Date</Table.HeaderCell>
                      <Table.HeaderCell>{stage === 'creation' ? 'Days till launch' : 'Launch Date'}</Table.HeaderCell>
                    </>
                  )
                  : <Table.HeaderCell>Hard Close Date</Table.HeaderCell>
                }
                {stage === 'live'
                  && <Table.HeaderCell>Days till close</Table.HeaderCell>
                }
                {stage !== 'engagement'
                  && <Table.HeaderCell>Lead</Table.HeaderCell>
                }
                <Table.HeaderCell>POC</Table.HeaderCell>
                <Table.HeaderCell>Securities</Table.HeaderCell>
                {stage === 'engagement'
                  && <Table.HeaderCell>Repayment Amount</Table.HeaderCell>
                }
                <Table.HeaderCell textAlign="center" />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {offerings.length === 0 ? (
                <Table.Row><Table.Cell colSpan={8} textAlign="center">No Offering to display !</Table.Cell></Table.Row>
              )
                : offerings.map(offering => (
                  <Table.Row key={offering.id} className={this.props.uiStore.inProgressArray.length && offering.id === this.state.loadingOfferId ? 'disabled' : ''}>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                      <b>{((offering.keyTerms && offering.keyTerms.shorthandBusinessName)
                        ? offering.keyTerms.shorthandBusinessName : (
                          (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
                        ))}
                      </b>
                    </Table.Cell>
                    <Table.Cell className="text-capitalize">
                      {offering && offering.stage
                        ? stage === 'live' && get(offering, 'closureSummary.processingDate') && DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).value <= 0
                          ? STAGES.PROCESSING.label
                          : stage === 'live' && get(offering, 'closureSummary.processingDate') && ((includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).isLokinPeriod)
                            ? STAGES.LOCK.label
                            : STAGES[offering.stage].label
                        : STAGES[offering.stage].label
                      }
                    </Table.Cell>
                    {stage !== 'engagement'
                      ? (
                        <>
                          <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>{get(offering, 'created.date') ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(offering, 'created.date'), true, false, false)} /> : 'N/A'}</Table.Cell>
                          <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                            {offering.offering && offering.offering.launch
                              && offering.closureSummary.launchDate
                              ? DataFormatter.diffDays(get(offering, 'closureSummary.launchDate'), false, true) < 0 ? DataFormatter.getDateAsPerTimeZone(get(offering, 'closureSummary.launchDate'), false, false, false) : DataFormatter.diffInDaysHoursMin(get(offering, 'closureSummary.launchDate')).diffText : 'N/A'
                            }
                          </Table.Cell>
                        </>
                      )
                      : <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>{get(offering, 'closureSummary.hardCloseDate') ? <DateTimeFormat isCSTFormat datetime={DataFormatter.getDateAsPerTimeZone(get(offering, 'closureSummary.hardCloseDate'), false, false, false)} /> : 'N/A'}</Table.Cell>
                    }
                    {stage === 'live'
                      && (
                        <Table.Cell>
                          {offering.closureSummary && offering.closureSummary.processingDate
                            ? DataFormatter.diffDays(get(offering, 'closureSummary.processingDate'), false, true) < 0 || DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).value === 0 ? get(offering, 'closureSummary.processingDate') : (includes(['Minute Left', 'Minutes Left'], DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).label) && DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).value > 0) || DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).value <= 48 ? `${DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).value} ${DataFormatter.getDateDifferenceInHoursOrMinutes(get(offering, 'closureSummary.processingDate'), true, true).label}` : DataFormatter.diffInDaysHoursMin(get(offering, 'closureSummary.processingDate')).diffText : 'N/A'
                          }
                        </Table.Cell>
                      )
                    }
                    {stage !== 'engagement'
                      && <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>{offering.leadDetails && offering.leadDetails.info ? `${offering.leadDetails.info.firstName} ${offering.leadDetails.info.lastName}` : 'N/A'}</Table.Cell>
                    }
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                      <p>
                        {offering.issuerDetails
                          ? (
                            <>
                              <b>
                                {offering.issuerDetails && offering.issuerDetails.info ? `${offering.issuerDetails.info.firstName} ${offering.issuerDetails.info.lastName}` : ''}
                              </b>
                              <br />
                              {get(offering, 'issuerDetails.email.address') ? offering.issuerDetails.email.address : ''}
                              <br />
                              {get(offering, 'issuerDetails.phone.number') ? Helper.maskPhoneNumber(get(offering, 'issuerDetails.phone.number')) : ''}
                            </>
                          )
                          : <b>N/A</b>
                        }
                      </p>
                    </Table.Cell>
                    <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>
                      {CAMPAIGN_KEYTERMS_SECURITIES[offering.keyTerms.securities]}
                    </Table.Cell>
                    {stage === 'engagement'
                      && <Table.Cell onClick={() => this.handleAction('Edit', offering.id)}>{offering && get(offering, 'closureSummary.repayment.currentRepaidAmount') ? `${Helper.CurrencyFormat(get(offering, 'closureSummary.repayment.currentRepaidAmount'))} (${get(offering, 'closureSummary.repayment.count')})` : 'N/A'}</Table.Cell>
                    }
                    <Table.Cell collapsing textAlign="center">
                      <Button.Group>
                        {Object.keys(actions).map(action => (
                          action.label === 'Delete' && stage === 'engagement' ? ''
                            : (
                              <Button icon className="link-button">
                                <Icon className={`ns-${actions[action].label === 'Publish' ? offering.isAvailablePublicly ? actions[action].icon : actions[action].icon1 : actions[action].icon}`} onClick={() => this.handleAction(actions[action].label, offering.id, !offering.isAvailablePublicly)} />
                              </Button>
                            )
                        ))}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))
              }
            </Table.Body>
          </Table>
        </div>
        {totalRecords > 0
          && <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
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
