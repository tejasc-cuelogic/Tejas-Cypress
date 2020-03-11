import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Grid, Tab } from 'semantic-ui-react';
import InvestNowTocList from './toc/InvestNowTocList';
import { CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('manageOfferingStore', 'uiStore', 'offeringsStore')
@withRouter
@observer
export default class InvestNowToc extends Component {
  render() {
    const { match, manageOfferingStore, uiStore, offeringsStore } = this.props;
    const { getAgreementTocList } = manageOfferingStore;
    const { offer } = offeringsStore;
    const regulation = get(offer, 'regulation');
    const { inProgress } = uiStore;
    const panes = Object.keys(getAgreementTocList).map(key => ({
      menuItem: CAMPAIGN_KEYTERMS_REGULATION[key], render: () => (<InvestNowTocList regulation={key} refLink={match.url} data={getAgreementTocList[key]} />),
    }));
    if (inProgress === 'save') {
      return (<InlineLoader />);
    }
    return (
      <div className="inner-content-spacer">
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
