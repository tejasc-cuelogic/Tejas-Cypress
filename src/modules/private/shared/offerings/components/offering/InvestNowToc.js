import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Grid, Tab, Form } from 'semantic-ui-react';
import InvestNowTocList from './toc/InvestNowTocList';
import { CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';
import OfferingButtonGroup from '../OfferingButtonGroup';

const metaInfo = {
  store: 'manageOfferingStore',
  form: 'INVEST_NOW_TOC_TEMPLATE_FRM',
};

@inject('manageOfferingStore', 'uiStore', 'offeringsStore')
@withRouter
@observer
class InvestNowToc extends Component {
  handleFormSubmit = () => {
    const { manageOfferingStore } = this.props;
    const { updateOffering } = manageOfferingStore;
    updateOffering({ keyName: 'investNow', forms: 'INVEST_NOW_TOC_TEMPLATE_FRM' });
  };

  render() {
    const { smartElement, match, manageOfferingStore, uiStore, offeringsStore } = this.props;
    const { getAgreementTocList, campaignStatus } = manageOfferingStore;
    const { offer } = offeringsStore;
    const regulation = get(offer, 'regulation');
    const { inProgress } = uiStore;
    const isReadOnly = campaignStatus.lock;
    const panes = Object.keys(getAgreementTocList).map(key => ({
      menuItem: CAMPAIGN_KEYTERMS_REGULATION[key], render: () => (<InvestNowTocList regulation={key} refLink={match.url} data={getAgreementTocList[key]} />),
    }));
    if (inProgress === 'save') {
      return (<InlineLoader />);
    }
    return (
      <div className="inner-content-spacer">
        <Form>
        <Grid stackable>
            <Grid.Row>
            <Grid.Column width={6}>
            {smartElement.FormDropDown('template', { containerclassname: 'dropdown-field', displayMode: isReadOnly })}
          </Grid.Column>
          <Grid.Column width={5} textAlign="right" floated="right">
          <OfferingButtonGroup
            buttonTitle="Update"
            updateOffer={this.handleFormSubmit}
          />
          </Grid.Column>
          </Grid.Row>
            </Grid>
        </Form>
        <Grid>
          <Grid.Column widescreen={16} computer={16}>
            {regulation !== 'BD_CF_506C' ? Object.keys(getAgreementTocList).map(key => (<InvestNowTocList regulation={key} refLink={match.url} data={getAgreementTocList[key]} />))
            : <Tab className="offering-creation-tab" panes={panes} />}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default formHOC(InvestNowToc, metaInfo);
