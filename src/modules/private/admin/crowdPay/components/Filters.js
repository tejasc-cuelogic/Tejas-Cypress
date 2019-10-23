import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormCheckbox } from '../../../../../theme/form';
import { DateRangeFilter } from '../../../../../theme/form/Filters';

@withRouter
export default class Filters extends Component {
  state = { error: '' };

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
                <DateRangeFilter filters={requestState.search} label="Creation date" nameStart="accountCreateFromDate" nameEnd="accountCreateToDate" name="createdAt" change={this.props.change} />
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
