import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';

@inject('uiStore')
@observer
export default class ButtonGroupType2 extends Component {
  render() {
    const { updateOffer, uiStore } = this.props;
    const { inProgress, htmlEditorImageLoading } = this.props.uiStore;
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
            <Button disabled={htmlEditorImageLoading} loading={inProgress === 'save'} primary onClick={updateOffer} color="green" className="relaxed">Save</Button>
          </Button.Group>
        </div>
      </>
    );
  }
}
