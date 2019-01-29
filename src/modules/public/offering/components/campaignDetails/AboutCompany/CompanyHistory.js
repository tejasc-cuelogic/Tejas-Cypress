import React, { Component } from 'react';
import { Header, List, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@observer
class CompanyHistory extends Component {
  render() {
    const { campaign } = this.props;
    const emptyHistoryStatement = 'History not found';
    return (
      <Aux>
        <Header as="h3" className="anchor-wrap mb-30">
          History
          <span className="anchor" id="history" />
        </Header>
        {
          campaign && campaign.offering && campaign.offering.about &&
            campaign.offering.about.history && campaign.offering.about.history.length ?
              <List className="history-section">
                {
                campaign.offering.about.history.map(data => (
                  <List.Item className="mb-30">
                    <Icon className="ns-flag-line" color="green" />
                    <List.Content>
                      <List.Header>{data.date}</List.Header>
                      <List.Description>
                        {data.description}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))
              }
              </List>
            :
              <InlineLoader text={emptyHistoryStatement} className="bg-offwhite" />
        }
      </Aux>
    );
  }
}

export default CompanyHistory;