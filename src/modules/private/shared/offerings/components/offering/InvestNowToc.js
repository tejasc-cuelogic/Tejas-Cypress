import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import { Grid, Tab, Form, Button, Icon, Confirm } from 'semantic-ui-react';
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
  state = {
    showConfirm: false,
  };

  handleFormSubmit = (type) => {
    const { manageOfferingStore } = this.props;
    const { updateOffering } = manageOfferingStore;
    updateOffering({ keyName: 'investNow', forms: 'INVEST_NOW_TOC_TEMPLATE_FRM', tocAction: type });
  };

  render() {
    const { showConfirm } = this.state;
    const { smartElement, match, manageOfferingStore, uiStore, offeringsStore } = this.props;
    const { getAgreementTocList, INVEST_NOW_TOC_TEMPLATE_FRM, campaignStatus } = manageOfferingStore;
    const { offer } = offeringsStore;
    const regulation = get(offer, 'regulation');
    const { inProgress } = uiStore;
    const isReadOnly = get(offer, 'stage') !== 'CREATION' || campaignStatus.lock;
    const tocTemplate = INVEST_NOW_TOC_TEMPLATE_FRM.fields.template.value;
    const showReset = (get(offer, 'stage') === 'CREATION' && tocTemplate === 2 && !!get(offer, 'investNow.page'));
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
              {!isReadOnly
              && (
              <Grid.Column width={5} textAlign="right" floated="right">
                <OfferingButtonGroup
                  buttonTitle="Update"
                  updateOffer={this.handleFormSubmit}
                />
              </Grid.Column>
              )}
            </Grid.Row>
            {showReset
            && (
            <Grid.Row>
              <Grid.Column textAlign="right" floated="right">
                <Button icon className="link-button" onClick={() => this.setState({ showConfirm: true })}>
                  <Icon color="green" size="large" className="ns-reload-circle" />
                </Button>
              </Grid.Column>
            </Grid.Row>
            )}
          </Grid>
        </Form>
        <Grid>
          <Grid.Column widescreen={16} computer={16}>
            {regulation !== 'BD_CF_506C' ? Object.keys(getAgreementTocList).map(key => (<InvestNowTocList regulation={key} refLink={match.url} data={getAgreementTocList[key]} />))
            : <Tab className="offering-creation-tab" panes={panes} />}
          </Grid.Column>
        </Grid>
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

export default formHOC(InvestNowToc, metaInfo);
