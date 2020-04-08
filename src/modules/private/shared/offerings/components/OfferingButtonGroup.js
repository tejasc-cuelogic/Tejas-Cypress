import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

@inject('uiStore', 'manageOfferingStore')
@observer
export default class OfferingButtonGroup extends Component {
  render() {
    const { updateOffer, uiStore, isDisable, buttonTitle, manageOfferingStore } = this.props;
    const { inProgress, htmlEditorImageLoading } = uiStore;
    const { campaignStatus } = manageOfferingStore;
    const isReadOnly = campaignStatus.lock;
    return (
      <>
        <div className="sticky-actions">
          <Button.Group vertical icon size="tiny" className="time-stamp">
            {/* {submitted
              && (
                <Button as="span" className="time-stamp">
                  <Icon className="ns-circle" color="green" />{' '}
                  Submitted by {submitted.by} on {moment(submitted.date).format('MM/DD/YYYY')}
                </Button>
              )
            }
            {approved && approved.status
              && (
                <Button as="span" className="time-stamp">
                  <Icon className="ns-check-circle" color="green" />{' '}
                  Approved by {approved.by} on {moment(approved.date).format('MM/DD/YYYY')}
                </Button>
              )
            } */}
          </Button.Group>
          <Button.Group vertical={uiStore.responsiveVars.isMobile} size={uiStore.responsiveVars.isMobile ? 'mini' : ''} compact={uiStore.responsiveVars.isMobile} className={uiStore.responsiveVars.isMobile ? 'sticky-buttons' : ''}>
            <Button disabled={isReadOnly || htmlEditorImageLoading || isDisable} loading={inProgress === 'save'} primary onClick={updateOffer} color="green" className="relaxed">{buttonTitle || 'Save'}</Button>
          </Button.Group>
        </div>
      </>
    );
  }
}
