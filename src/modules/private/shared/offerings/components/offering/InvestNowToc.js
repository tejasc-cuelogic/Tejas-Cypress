import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Grid, Tab, Form, Confirm, Button } from 'semantic-ui-react';
import InvestNowTocList from './toc/InvestNowTocList';
import { CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';
// import OfferingButtonGroup from '../OfferingButtonGroup';

@inject('manageOfferingStore', 'uiStore', 'offeringsStore')
@withRouter
@observer
class InvestNowToc extends Component {
  state = {
    showConfirm: false,
  };

  handleFormSubmit = (type) => {
    const { manageOfferingStore } = this.props;
    const { updateOffering } = manageOfferingStore;
    updateOffering({ keyName: 'investNow', offeringData: { template: 2 }, tocAction: type });
  };

  render() {
    const { showConfirm } = this.state;
    const { match, manageOfferingStore, uiStore, offeringsStore } = this.props;
    const { getAgreementTocList, campaignStatus } = manageOfferingStore;
    const { offer, offerDataLoading } = offeringsStore;
    const regulation = get(offer, 'regulation');
    const securities = get(offer, 'keyTerms.securities');
    const showWarningMsg = (!regulation || !securities);
    const { inProgress } = uiStore;
    const isReadOnly = get(offer, 'stage') !== 'CREATION' || campaignStatus.lock;
    const tocTemplate = get(offer, 'investNow.template');
    const showReset = (get(offer, 'stage') === 'CREATION' && tocTemplate === 2 && !!get(offer, 'investNow.page[0]'));
    const panes = Object.keys(getAgreementTocList).map(key => ({
      menuItem: CAMPAIGN_KEYTERMS_REGULATION[key], render: () => (<InvestNowTocList regulation={key} refLink={match.url} data={getAgreementTocList[key]} />),
    }));
    if (inProgress === 'save' || offerDataLoading) {
      return (<InlineLoader />);
    }
    return (
      <div className="inner-content-spacer">
        <Form>
          <Grid stackable>
            {showWarningMsg ? <Grid.Row><span className="negative-text mt-10 ml-10">Please select and verify the offering Regulation and Security (and equity class for Equity).</span></Grid.Row>
            : (!isReadOnly || showReset) && (
            <Grid.Row>
              <Grid.Column textAlign="right" floated="right">
                <Button.Group size="mini" textAlign="right" floated="right">
                  <Button disabled={inProgress} loading={inProgress === 'save'} primary onClick={() => (showReset ? this.setState({ showConfirm: true }) : this.handleFormSubmit('EDIT'))} color="green" className="relaxed" content={showReset ? 'Reset' : 'Edit'} />
                </Button.Group>
              </Grid.Column>
              {/* {(!isReadOnly || showReset)
              && (
              <Grid.Column textAlign="right" floated="right">
                <OfferingButtonGroup
                  buttonTitle={showReset ? 'Reset' : 'Edit'}
                  updateOffer={() => (showReset ? this.setState({ showConfirm: true }) : this.handleFormSubmit('EDIT'))}
                />
              </Grid.Column>
              )} */}
            </Grid.Row>
            )}
          </Grid>
        </Form>
        {!showWarningMsg
        && (
        <Grid>
          <Grid.Column widescreen={16} computer={16}>
            {regulation !== 'BD_CF_506C' ? Object.keys(getAgreementTocList).map(key => (<InvestNowTocList regulation={key} refLink={match.url} data={getAgreementTocList[key]} />))
            : <Tab className="offering-creation-tab" panes={panes} />}
          </Grid.Column>
        </Grid>
        )}
        <Confirm
          header="Confirm"
          content="Are you sure you want to reset invest now toc with ns-default values?"
          open={showConfirm}
          onCancel={() => this.setState({ showConfirm: false })}
          onConfirm={() => this.handleFormSubmit('RESET')}
          size="mini"
          className="deletion"
        />
      </div>
    );
  }
}

export default InvestNowToc;
