/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid, Tab } from 'semantic-ui-react';
import { arrayMove } from 'react-sortable-hoc';
import InvestNowTocList from './toc/InvestNowTocList';
import { CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';

@inject('manageOfferingStore', 'offeringsStore')
@withRouter
@observer
export default class InvestNowToc extends Component {
  // state = { activeIndex: 0 }

  // toggleAccordianContent = (categoryIndex = null) => {
  //   const index = categoryIndex;
  //   const { activeIndex } = this.state;
  //   const newIndex = activeIndex;

  //   const currentIndexPosition = activeIndex.indexOf(index);
  //   if (currentIndexPosition > -1) {
  //     newIndex.splice(currentIndexPosition, 1);
  //   } else {
  //     newIndex.push(index);
  //   }

  //   this.setState({ activeIndex: newIndex });
  // };

  // onTabChange = (e, data) => {
  //   e.preventDefault();
  //   this.setState({ activeIndex: data.activeIndex });
  //   // this.toggleAccordianContent(data.activeIndex);
  // }

  render() {
    const { match, manageOfferingStore } = this.props;
    const { getAgreementTocList } = manageOfferingStore;
    const panes = Object.keys(getAgreementTocList).map((key, index) => ({
      menuItem: CAMPAIGN_KEYTERMS_REGULATION[key], render: () => (<InvestNowTocList index={index} refLink={match.url} data={getAgreementTocList[key]} />),
    }));
    // const isReadOnly = get(offer, 'stage') === 'CREATION';
    return (
      <div className="inner-content-spacer">
        <Grid>
          <Grid.Column widescreen={16} computer={16}>
            <Tab className="offering-creation-tab" panes={panes} />
          </Grid.Column>
        </Grid>
      </div>
      // <div className="inner-content-spacer">
      //   <Grid>
      //     <Grid.Column widescreen={16} computer={16}>
      //     {Object.keys(getAgreementTocList).map((key, index) => (
      //       <Accordion exclusive={false} fluid styled className={`card-style ${index === 0 ? 'mt-20' : ''}`}>
      //       <Accordion.Title onClick={() => this.toggleAccordianContent(index)}>
      //         <Icon className={activeIndex.includes(index) ? 'ns-chevron-up' : 'ns-chevron-down'} />
      //         {CAMPAIGN_KEYTERMS_REGULATION[key]}
      //       </Accordion.Title>
      //       <Accordion.Content active={activeIndex.includes(index)} className="categories-acc">
      //         <InvestNowTocList refLink={match.url} data={getAgreementTocList[key]} />
      //       </Accordion.Content>
      //     </Accordion>
      //     ))}
      //     </Grid.Column>
      //   </Grid>
      // </div>
    );
  }
}
