import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('campaignStore')
@observer
class UpdateDetails extends Component {
  render() {
    const indexId = this.props.match.params.id ? this.props.match.params.id : 0;
    const { campaign } = this.props.campaignStore;
    const updatesDetails = campaign && campaign.updates;
    const updates = updatesDetails && updatesDetails.length ? updatesDetails[indexId] : null;
    return (
      updates ?
        <Aux>
          <Header as="h4">
            {updates.title}
            <Header.Subheader className="mt-half">{updates.updated.date}</Header.Subheader>
          </Header>
          <p dangerouslySetInnerHTML={{ __html: updates.content }} />
        </Aux>
        :
        <InlineLoader text="No data found." />
    );
  }
}

export default UpdateDetails;
