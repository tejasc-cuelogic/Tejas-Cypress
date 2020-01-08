import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { DropdownFilter } from '../../../../../../theme/form/Filters';

export default class Filters extends Component {
  render() {
    const { requestState, setSearchParam } = this.props;
    return (
      <>
        <Grid.Column width={4}>
          <DropdownFilter value={requestState.search.tier} name="Tier" change={setSearchParam} options={[]} />
        </Grid.Column>
        <Grid.Column width={4}>
          <DropdownFilter value={requestState.search.code} name="Referal code" change={setSearchParam} options={[]} />
        </Grid.Column>
        <Grid.Column width={4}>
          <DropdownFilter value={requestState.search.location} name="Location" change={setSearchParam} options={[]} />
        </Grid.Column>
      </>
    );
  }
}
