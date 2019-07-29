import React, { Component } from 'react';
import { Header, List, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 992;
@inject('campaignStore')
@observer
class CompanyHistory extends Component {
  render() {
    const { campaign } = this.props;
    const emptyHistoryStatement = 'History not found';
    return (
      <>
        <Header as="h3" className={`${(this.props.newLayout && isMobile) ? 'mt-40 mb-10' : this.props.newLayout ? 'mt-40 mb-30' : 'mt-20 mb-30'} anchor-wrap`}>
          History
          <span className="anchor" id="history" />
        </Header>
        {
          campaign && campaign.offering && campaign.offering.about
            && campaign.offering.about.history && campaign.offering.about.history.length
            ? (
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
            )
            : <InlineLoader text={emptyHistoryStatement} className="bg-offwhite" />
        }
      </>
    );
  }
}

export default CompanyHistory;
