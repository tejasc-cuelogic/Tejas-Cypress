/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { DataFormatter } from '../../../../../helper';
import { DateTimeFormat, InlineLoader } from '../../../../../theme/shared';
import { STAGES } from '../../../../../services/constants/admin/offerings';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import Helper from '../../../../../helper/utility';

const actions = {
  edit: { label: 'Edit', icon: 'pencil' },
  delete: { label: 'Delete', icon: 'trash' },
  publish: { label: 'Publish', icon: 'view', icon1: 'no-view' },
};
const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  offering, handleAction, stage,
}) => (
  <div className="row-wrap striped-table">
    <div className="balance-half first-column">
      <DragHandle />
      <a onClick={() => handleAction('Edit', offering.id)}>
        {((offering.keyTerms && offering.keyTerms.shorthandBusinessName) ?
          offering.keyTerms.shorthandBusinessName : (
          (offering.keyTerms && offering.keyTerms.legalBusinessName) ? offering.keyTerms.legalBusinessName : 'N/A'
        ))}
      </a>
    </div>
    <div className="balance">
      {offering && offering.stage ?
        stage === 'live' && get(offering, 'closureSummary.processingDate') && DataFormatter.diffDays(get(offering, 'closureSummary.processingDate'), false, true) <= 0 ?
          STAGES.PROCESSING.label
        : stage === 'live' && get(offering, 'closureSummary.processingDate') && DataFormatter.diffDays(get(offering, 'closureSummary.processingDate'), false, true) > 0 && DataFormatter.diffDays(get(offering, 'closureSummary.processingDate'), false, true) <= 2 ?
          STAGES.LOCK.label
          : STAGES[offering.stage].label
        : STAGES[offering.stage].label
      }
    </div>
    {stage !== 'engagement' ?
      <Aux>
        <div className="balance" onClick={() => handleAction('Edit', offering.id)}>
          {get(offering, 'created.date') ? <DateTimeFormat datetime={get(offering, 'created.date')} /> : 'N/A'}
        </div>
        <div className="balance" onClick={() => handleAction('Edit', offering.id)}>
          {offering.offering && offering.offering.launch &&
            offering.offering.launch.targetDate ?
            DataFormatter.diffDays(get(offering, 'offering.launch.targetDate'), false, true) < 0 ? get(offering, 'offering.launch.targetDate') : DataFormatter.diffInDaysHoursMin(get(offering, 'offering.launch.targetDate')).diffText : 'N/A'
          }
        </div>
      </Aux>
      :
      <div className="balance" onClick={() => handleAction('Edit', offering.id)}>
        {get(offering, 'closureSummary.hardCloseDate') ? <DateTimeFormat datetime={get(offering, 'closureSummary.hardCloseDate')} /> : 'N/A'}
      </div>
    }
    {stage === 'live' &&
      <div className="balance">
        {offering.closureSummary && offering.closureSummary.processingDate ?
        DataFormatter.diffDays(get(offering, 'closureSummary.processingDate'), false, true) < 0 ? get(offering, 'closureSummary.processingDate') : DataFormatter.diffInDaysHoursMin(get(offering, 'closureSummary.processingDate')).diffText : 'N/A'
        }
      </div>
    }
    <div className="balance" onClick={() => handleAction('Edit', offering.id)}>
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
    </div>
    <div className="balance">
      {CAMPAIGN_KEYTERMS_SECURITIES[offering.keyTerms.securities]}
    </div>
    {stage === 'engagement' &&
      <div className="balance" onClick={() => handleAction('Edit', offering.id)}>
        {offering && get(offering, 'closureSummary.repayment.currentRepaidAmount') ? `${Helper.CurrencyFormat(get(offering, 'closureSummary.repayment.currentRepaidAmount'))} (${get(offering, 'closureSummary.repayment.count')})` : 'N/A'}
      </div>
    }
    <div className="action width-130 right-align">
      <Button.Group>
        {Object.keys(actions).map(action => (
          action.label === 'Delete' && stage === 'engagement' ? '' :
          <Button icon className="link-button" >
            <Icon className={`ns-${actions[action].label === 'Publish' ? offering.isAvailablePublicly ? actions[action].icon : actions[action].icon1 : actions[action].icon}`} onClick={() => handleAction(actions[action].label, offering.id, !offering.isAvailablePublicly)} />
          </Button>
        ))}
      </Button.Group>
    </div>
  </div>
));
const SortableList = SortableContainer(({
  allOfferingsList, handleAction, stage,
}) => (
  <div className="tbody">
    {allOfferingsList.map((offering, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        docIndx={index}
        offering={offering}
        handleAction={handleAction}
        index={index}
        stage={stage}
      />
    ))}
  </div>
));
@inject('uiStore', 'offeringsStore', 'offeringCreationStore')
@withRouter
@observer
export default class DraggableListing extends Component {
  state = { isPublic: false };
  componentWillMount() {
    this.props.offeringCreationStore.setFieldValue('isListingPage', true);
    this.props.offeringsStore.resetInitLoad();
    this.props.offeringCreationStore.resetInitLoad();
    this.props.offeringsStore.resetPagination();
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { allOfferingsList, setOrderForOfferings } = this.props.offeringsStore;
    if (oldIndex !== newIndex) {
      setOrderForOfferings(arrayMove(allOfferingsList, oldIndex, newIndex), this.props.stage);
    }
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
      uiStore, offeringsStore, stage,
    } = this.props;
    const { allOfferingsList, loading } = offeringsStore;
    const { confirmBox, inProgress } = uiStore;
    if (loading || inProgress) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <div className="ui card fluid">
          <div className="ui basic table">
            <div className="row-wrap striped-table thead">
              <div className="balance-half first-column">Name</div>
              <div className="balance">Status</div>
              {stage !== 'engagement' ?
                <Aux>
                  <div className="balance">Created Date</div>
                  <div className="balance">{stage === 'creation' ? 'Days till launch' : 'Launch Date'}</div>
                </Aux>
                : <div className="balance">Hard Close Date</div>
              }
              {stage === 'live' &&
                <div className="balance">Days till close</div>
              }
              <div className="balance">POC</div>
              <div className="balance">Securities</div>
              {stage === 'engagement' &&
                <div className="balance">Repayment Amount</div>
              }
              <div className="action width-130 right-align" />
            </div>
            <SortableList
              allOfferingsList={allOfferingsList}
              pressDelay={100}
              handleAction={this.handleAction}
              onSortEnd={e => this.onSortEnd(e)}
              stage={stage}
              lockAxis="y"
              useDragHandle
            />
          </div>
        </div>
        <Confirm
          header="Confirm"
          content={confirmBox.entity === 'Publish' ? `Are you sure you want to make this offering ${this.state.isPublic ? 'Public' : 'Non-Public'}?` : 'Are you sure you want to delete this offering?'}
          open={confirmBox.entity === 'Delete' || confirmBox.entity === 'Publish'}
          onCancel={this.handleDeleteCancel}
          onConfirm={confirmBox.entity === 'Publish' ? this.handlePublishOffering : this.handleDeleteOffering}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
