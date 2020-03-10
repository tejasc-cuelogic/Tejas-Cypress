import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid, Tab } from 'semantic-ui-react';
import InvestNowTocList from './toc/InvestNowTocList';
import { CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('manageOfferingStore', 'offeringsStore', 'uiStore')
@withRouter
@observer
export default class InvestNowToc extends Component {
  render() {
    const { match, manageOfferingStore, uiStore } = this.props;
    const { getAgreementTocList } = manageOfferingStore;
    const { inProgress } = uiStore;
    const panes = Object.keys(getAgreementTocList).map((key, index) => ({
      menuItem: CAMPAIGN_KEYTERMS_REGULATION[key], render: () => (<InvestNowTocList regulation={key} index={index} refLink={match.url} data={getAgreementTocList[key]} />),
    }));
    if (inProgress === 'save') {
      return (<InlineLoader />);
    }
    // const isReadOnly = get(offer, 'stage') === 'CREATION';
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={16} computer={16}>
            <Tab className="offering-creation-tab" panes={panes} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
