import React from 'react';
// import _ from 'lodash';
import { Header, Form, Dropdown, Card, Input, Label, Divider, Icon, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect

import { COUNTRIES, XML_STATUSES } from '../../../../constants/business';
import validationActions from '../../../../actions/validation';
import busiessActions from '../../../../actions/business';
import Helper from '../../../../helper/utility';

@inject('businessStore')
@withRouter
@observer
export default class AnnualReportDisclosureRequirements extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }
  handleInputChange = (e, { name, value }) => {
    this.props.businessStore.setAnnualReportInfo(name, value);
  }

  handleOnBlur = e => validationActions.validateAnnualReportField(e.target.name)

  handleSelectChange = (e, { dataidentifier, name, value }) => {
    this.props.businessStore.setCountry(dataidentifier, name, value);
  }

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  handleAnnualSubmit = (e) => {
    e.preventDefault();
    const { annualReportRequirements } = this.props.businessStore;
    busiessActions.validateAnnualReportInfo(annualReportRequirements);

    if (this.props.businessStore.canSubmitAnnualReportXmlForm) {
      busiessActions.submitXMLInformation('annualReport')
        .then((data) => {
          this.props.businessStore.setXmlError();
          this.props.businessStore.setXmlActiveTabId(4);
          if (this.props.businessStore.xmlSubmissionId === undefined) {
            const { xmlSubmissionId } = data.upsertXmlInformation;
            this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
          }
          Helper.toast('Offering information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  render() {
    const { annualReportRequirements, xmlSubmissionStatus } = this.props.businessStore;
    return (
      <div>
        <Card fluid className="form-card">
          <Form.Field>
            <Form.Input
              label={annualReportRequirements.currentEmployees.label}
              name={annualReportRequirements.currentEmployees.key}
              value={annualReportRequirements.currentEmployees.value}
              error={!!annualReportRequirements.currentEmployees.error}
              onChange={this.handleInputChange}
              onBlur={this.handleOnBlur}
              key={annualReportRequirements.currentEmployees.key}
            />
          </Form.Field>
        </Card>
        <Card.Group itemsPerRow={2}>
          <Card fluid className="form-card">
            <Header as="h3">Total Assets</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.totalAssetMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.totalAssetMostRecentFiscalYear.key}
                value={annualReportRequirements.totalAssetMostRecentFiscalYear.value}
                error={!!annualReportRequirements.totalAssetMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.totalAssetMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.totalAssetPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.totalAssetPriorFiscalYear.key}
                value={annualReportRequirements.totalAssetPriorFiscalYear.value}
                error={!!annualReportRequirements.totalAssetPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.totalAssetPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>
          <Card fluid className="form-card">
            <Header as="h3">Cash and Cash Equivalents</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.cashEquiMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.cashEquiMostRecentFiscalYear.key}
                value={annualReportRequirements.cashEquiMostRecentFiscalYear.value}
                error={!!annualReportRequirements.cashEquiMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.cashEquiMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.cashEquiPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.cashEquiPriorFiscalYear.key}
                value={annualReportRequirements.cashEquiPriorFiscalYear.value}
                error={!!annualReportRequirements.cashEquiPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.cashEquiPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>
          <Card fluid className="form-card">
            <Header as="h3">Accounts Receivable</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.actReceivedMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.actReceivedMostRecentFiscalYear.key}
                value={annualReportRequirements.actReceivedMostRecentFiscalYear.value}
                error={!!annualReportRequirements.actReceivedMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.actReceivedMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.actReceivedPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.actReceivedPriorFiscalYear.key}
                value={annualReportRequirements.actReceivedPriorFiscalYear.value}
                error={!!annualReportRequirements.actReceivedPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.actReceivedPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>
          <Card fluid className="form-card">
            <Header as="h3">Short-term Debt</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.shortTermDebtMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.shortTermDebtMostRecentFiscalYear.key}
                value={annualReportRequirements.shortTermDebtMostRecentFiscalYear.value}
                error={!!annualReportRequirements.shortTermDebtMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.shortTermDebtMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.shortTermDebtPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.shortTermDebtPriorFiscalYear.key}
                value={annualReportRequirements.shortTermDebtPriorFiscalYear.value}
                error={!!annualReportRequirements.shortTermDebtPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.shortTermDebtPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>
          <Card fluid className="form-card">
            <Header as="h3">Long-term Debt</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.longTermDebtMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.longTermDebtMostRecentFiscalYear.key}
                value={annualReportRequirements.longTermDebtMostRecentFiscalYear.value}
                error={!!annualReportRequirements.longTermDebtMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.longTermDebtMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.longTermDebtPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.longTermDebtPriorFiscalYear.key}
                value={annualReportRequirements.longTermDebtPriorFiscalYear.value}
                error={!!annualReportRequirements.longTermDebtPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.longTermDebtPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>

          <Card fluid className="form-card">
            <Header as="h3">Revenue/Sales</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.revenueMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.revenueMostRecentFiscalYear.key}
                value={annualReportRequirements.revenueMostRecentFiscalYear.value}
                error={!!annualReportRequirements.revenueMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.revenueMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.revenuePriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.revenuePriorFiscalYear.key}
                value={annualReportRequirements.revenuePriorFiscalYear.value}
                error={!!annualReportRequirements.revenuePriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.revenuePriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>

          <Card fluid className="form-card">
            <Header as="h3">Cost of Goods Sold</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.costGoodsSoldMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.costGoodsSoldMostRecentFiscalYear.key}
                value={annualReportRequirements.costGoodsSoldMostRecentFiscalYear.value}
                error={!!annualReportRequirements.costGoodsSoldMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.costGoodsSoldMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.costGoodsSoldPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.costGoodsSoldPriorFiscalYear.key}
                value={annualReportRequirements.costGoodsSoldPriorFiscalYear.value}
                error={!!annualReportRequirements.costGoodsSoldPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.costGoodsSoldPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>

          <Card fluid className="form-card">
            <Header as="h3">Taxes Paid</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.taxPaidMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.taxPaidMostRecentFiscalYear.key}
                value={annualReportRequirements.taxPaidMostRecentFiscalYear.value}
                error={!!annualReportRequirements.taxPaidMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.taxPaidMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.taxPaidPriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.taxPaidPriorFiscalYear.key}
                value={annualReportRequirements.taxPaidPriorFiscalYear.value}
                error={!!annualReportRequirements.taxPaidPriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.taxPaidPriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>
          <Card fluid className="form-card">
            <Header as="h3">Net Income</Header>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.netIncomeMostRecentFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.netIncomeMostRecentFiscalYear.key}
                value={annualReportRequirements.netIncomeMostRecentFiscalYear.value}
                error={!!annualReportRequirements.netIncomeMostRecentFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.netIncomeMostRecentFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
            <Form.Field>
              { /* eslint-disable jsx-a11y/label-has-for */ }
              <label>{annualReportRequirements.netIncomePriorFiscalYear.label}</label>
              <Input
                name={annualReportRequirements.netIncomePriorFiscalYear.key}
                value={annualReportRequirements.netIncomePriorFiscalYear.value}
                error={!!annualReportRequirements.netIncomePriorFiscalYear.error}
                onChange={this.handleInputChange}
                onBlur={this.handleOnBlur}
                key={annualReportRequirements.netIncomePriorFiscalYear.key}
                labelPosition="left"
                type="text"
                placeholder="0.00"
              >
                <Label basic>$</Label>
                <input />
              </Input>
            </Form.Field>
          </Card>
          <Card fluid className="form-card">
            <Header as="h3">Select States and Jurisdictions</Header>
            <Form.Field>
              <Dropdown
                fluid
                multiple
                search
                selection
                placeholder="State"
                dataidentifier="annualReportRequirements"
                name="issueJurisdictionSecuritiesOffering"
                options={COUNTRIES}
                onChange={this.handleSelectChange}
                error={!!annualReportRequirements.issueJurisdictionSecuritiesOffering.error}
                key={annualReportRequirements.issueJurisdictionSecuritiesOffering.key}
                value={annualReportRequirements.issueJurisdictionSecuritiesOffering.value}
              />
            </Form.Field>
          </Card>
        </Card.Group>
        <Divider hidden />
        <div className="right-align">
          <Button color="green" size="large" className="pull-left" onClick={() => this.props.businessStore.setXmlActiveTabId(2)}>
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          {
            xmlSubmissionStatus !== XML_STATUSES.completed &&
            <Button color="green" size="large" onClick={this.handleAnnualSubmit}>
              Save & Next <Icon name="chevron right" />
            </Button>
          }
        </div>
      </div>
    );
  }
}
