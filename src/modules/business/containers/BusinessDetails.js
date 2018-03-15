import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button, Grid, Form } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';
import FieldError from '../../../components/common/FieldError';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
  }
  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

  handleEditBusinessName = () => {
    this.props.businessStore.setEditBusinessName(true);
  }

  handleOnChange = (e, { name, value }) => {
    this.props.businessStore.setBusinessDetailsOnEdit(name, value);
  }

  handleOnBlur = (e) => {
    businessActions.validateBusinessNameOnEdit(e.target.name);
  }

  handleSubmitBusinessName = () => {
    businessActions.editBusinessName();
  }

  render() {
    const { business, editBusinessName } = this.props.businessStore;
    let viewBusinessNameStyle = {
      display: 'block',
    };
    let editBusinessNameStyle = {
      display: 'none',
    };
    if (editBusinessName) {
      viewBusinessNameStyle = {
        display: 'none',
      };
      editBusinessNameStyle = {
        display: 'block',
      };
    }
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h3>
                  <div style={viewBusinessNameStyle}>
                    <Link to="/app/business" className="back-link"><Icon name="long arrow left" /></Link>
                    {business.name.value} <Icon onClick={this.handleEditBusinessName} name="write" size="small" />
                  </div>
                  <div style={editBusinessNameStyle}>
                    <Form inverted>
                      <Form.Input
                        label="Business Name"
                        className="column"
                        width={8}
                        name={business.name.key}
                        value={business.name.value}
                        error={!!business.name.error}
                        onChange={this.handleOnChange}
                        onBlur={this.handleOnBlur}
                      />
                      <Form.TextArea
                        label="Description"
                        className="column"
                        width={8}
                        name={business.desc.key}
                        value={business.desc.value}
                        error={!!business.desc.error}
                        onChange={this.handleOnChange}
                      />
                      <FieldError error={business.name.error} />
                      <Button onClick={this.handleSubmitBusinessName}>Submit</Button>
                    </Form>
                  </div>
                  <Button floated="right"><Icon name="trash" /></Button>
                </h3>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <p>{business.desc.value}</p>
          <FillingsList
            filings={business.filings}
            handleAccordionClick={this.handleAccordionTitleClick}
            openAccordion={this.props.uiStore.openAccordion}
            businessId={this.props.match.params.businessId}
          />
        </div>
      </div>
    );
  }
}
