import React, { Component } from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { FormCheckbox } from '../../../../../theme/form';
import { DateRangeFilter } from '../../../../../theme/form/Filters';

@withRouter
export default class Filters extends Component {
  render() {
    const {
      requestState, change, filters, FILTER_FRM, fChange,
    } = this.props;
    const type = this.props.history.location.pathname === '/app/crowdpay' ? 'review' : this.props.history.location.pathname.includes('cip') ? 'cip' : this.props.history.location.pathname.includes('ira') ? 'ira' : this.props.history.location.pathname.includes('review') ? 'review' : 'entity';
    return (
      <div className={`search-filters more ${!filters ? 'collapsed' : ''}`}>
        <Form>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <DateRangeFilter filters={requestState.search} label="Creation date" name="createdAt" change={change} />
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
          </Grid>
        </Form>

      </div>
    );
  }
}
