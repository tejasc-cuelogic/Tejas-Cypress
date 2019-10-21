import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { FormCheckbox } from '../../../../../theme/form';
import { DateRangeFilter } from '../../../../../theme/form/Filters';

@withRouter
export default class Filters extends Component {
  state = { error: '' };

  validateDate = (values, fieldName, isEndDate = false) => {
    const year = moment(values.formattedValue, 'MM-DD-YYYY', true).year();
    if (moment(values.formattedValue, 'MM/DD/YYYY').isValid() && year < 1950) {
      this.setState({ error: 'Date year should be greate or equal to 1950' });
    } else if (isEndDate && year > 1950 && moment(values.formattedValue, 'MM/DD/YYYY').isValid() && !moment(values.formattedValue, 'MM/DD/YYYY').isSameOrBefore(moment())) {
      this.setState({ error: 'End date should not be greater than todays date' });
    } else {
      this.setState({ error: '' });
      this.props.change(values, fieldName);
    }
  }

  render() {
    const {
      requestState, filters, FILTER_FRM, fChange,
    } = this.props;
    const type = this.props.history.location.pathname === '/app/crowdpay' ? 'review' : this.props.history.location.pathname.includes('individual') ? 'individual' : this.props.history.location.pathname.includes('ira') ? 'ira' : this.props.history.location.pathname.includes('review') ? 'review' : 'entity';
    return (
      <div className={`search-filters more ${!filters ? 'collapsed' : ''}`}>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <DateRangeFilter filters={requestState.search} label="Creation date" nameStart="accountCreateFromDate" nameEnd="accountCreateToDate" name="createdAt" change={this.validateDate} />
              </Grid.Column>
              <Grid.Column width={9}>
                <FormCheckbox
                  fielddata={FILTER_FRM.fields[type]}
                  name={type}
                  changed={fChange}
                  defaults
                  containerclassname="ui list horizontal"
                />
              </Grid.Column>
            </Grid.Row>
            <p className="negative-text">{this.state.error || ''}</p>
          </Grid>
        </Form>

      </div>
    );
  }
}
