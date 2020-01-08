import React from 'react';
import { Header, Form, Card } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect

import { COUNTRIES } from '../../../../../../constants/business';
import { FormInput, FormDropDown } from '../../../../../../theme/form';

@inject('businessStore')
@withRouter
@observer
export default class AnnualReportDisclosureRequirements extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  render() {
    const { formAnnualInfo, annualInfoChange } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Form.Field>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.currentEmployees}
              name="currentEmployees"
              changed={annualInfoChange}
            />
          </Form.Field>
        </Card>
        <Card.Group stackable itemsPerRow={2}>
          <Card fluid className="form-card">
            <Header as="h5">Total Assets</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.totalAssetMostRecentFiscalYear}
              name="totalAssetMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.totalAssetPriorFiscalYear}
              name="totalAssetPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Cash and Cash Equivalents</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.cashEquiMostRecentFiscalYear}
              name="cashEquiMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.cashEquiPriorFiscalYear}
              name="cashEquiPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Accounts Receivable</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.actReceivedMostRecentFiscalYear}
              name="actReceivedMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.actReceivedPriorFiscalYear}
              name="actReceivedPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Short-term Debt</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.shortTermDebtMostRecentFiscalYear}
              name="shortTermDebtMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.shortTermDebtPriorFiscalYear}
              name="shortTermDebtPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Long-term Debt</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.longTermDebtMostRecentFiscalYear}
              name="longTermDebtMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.longTermDebtPriorFiscalYear}
              name="longTermDebtPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Revenue/Sales</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.revenueMostRecentFiscalYear}
              name="revenueMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.revenuePriorFiscalYear}
              name="revenuePriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Cost of Goods Sold</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.costGoodsSoldMostRecentFiscalYear}
              name="costGoodsSoldMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.costGoodsSoldPriorFiscalYear}
              name="costGoodsSoldPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Taxes Paid</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.taxPaidMostRecentFiscalYear}
              name="taxPaidMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.taxPaidPriorFiscalYear}
              name="taxPaidPriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Net Income</Header>
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.netIncomeMostRecentFiscalYear}
              name="netIncomeMostRecentFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
            <FormInput
              type="text"
              fielddata={formAnnualInfo.fields.netIncomePriorFiscalYear}
              name="netIncomePriorFiscalYear"
              changed={annualInfoChange}
              prefix="$"
            />
          </Card>
          <Card fluid className="form-card">
            <Header as="h5">Select States and Jurisdictions</Header>
            <FormDropDown
              fielddata={formAnnualInfo.fields.issueJurisdictionSecuritiesOffering}
              multiple
              search
              selection
              containerclassname="dropdown-field"
              value={formAnnualInfo.fields.issueJurisdictionSecuritiesOffering.value}
              name="issueJurisdictionSecuritiesOffering"
              options={COUNTRIES}
              onChange={annualInfoChange}
            />
          </Card>
        </Card.Group>
      </div>
    );
  }
}
