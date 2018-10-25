import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../../theme/shared';
// import videoPoster from '../../../../../../../assets/images/683547643.jpg';

// const updates = {
//   title: 'Featurette on Ben McPherson and BOH Pasta',
//   date: 'Dec 17th 2017',
//   embed: '131191237',
//   content: `Check out our chef featurette video on Ben McPherson,
// Founder of Krisp Bird & Batter.
//     He was inspired by trips with his father to Italy and is bringing the concept of BOH Pasta
//     to the Bravery Chef Hall.`,
// };

@inject('campaignStore')
@observer
class UpdateDetails extends Component {
  componentWillMount() {
    this.props.campaignStore.getCampaignDetails(this.props.match.params.id, true);
  }
  render() {
    const indexId = this.props.match.params.id ? this.props.match.params.id : 0;
    const { campaign } = this.props.campaignStore;
    const updatesDetails = campaign && campaign.updates;
    const updates = updatesDetails && updatesDetails.length ? updatesDetails[indexId] : [];
    return (
      updates ?
        <Aux>
          <Header as="h4">
            {updates.title}
            <Header.Subheader className="mt-half">{updates.updated.date}</Header.Subheader>
          </Header>
          {/* <Embed
          id={updates.embed}
          placeholder={videoPoster}
          source="vimeo"
        /> */}
          <p dangerouslySetInnerHTML={{ __html: updates.content }} />
        </Aux>
        :
        <InlineLoader text="No data found." />
    );
  }
}

export default UpdateDetails;
