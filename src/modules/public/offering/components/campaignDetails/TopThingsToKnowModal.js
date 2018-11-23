import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Modal, Icon, Popup, List } from 'semantic-ui-react';
import { INDUSTRY_TYPES, CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../constants/offering';
import { InlineLoader } from '../../../../../theme/shared';

@inject('campaignStore')
@observer
class TopThingsToKnowModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Top Things to know</Modal.Header>
        <Modal.Content scrolling>
          <Aux>
            <p>
              <b>Type of Raise: </b>
              {campaign && campaign.keyTerms && campaign.keyTerms.securities ? CAMPAIGN_KEYTERMS_SECURITIES[campaign.keyTerms.securities] : ''}
              <Popup hoverable position="bottom center" trigger={<Icon name="help circle" color="green" />} content={(<span>For every $100 you invest, you are paid a portion of this company&apos;s gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. <a target="blank" href="https://www.nextseed.com/offerings/buffbrew-taproom/#returnsGraphAnchor">See some examples</a>.</span>)} />
            </p>
            <b>Industry: </b>
            {campaign && campaign.keyTerms && INDUSTRY_TYPES[campaign.keyTerms.industry]}<br />
            <p className="detail-section" dangerouslySetInnerHTML={{ __html: campaign && campaign.offering && campaign.offering.about && campaign.offering.about.theCompany }} />
            <p>
              {campaign && campaign.offering && campaign.offering.overview &&
                campaign.offering.overview.highlight ?
                  <List bulleted>
                    {campaign.offering.overview.highlight.map(field => (
                      <List.Item>{field}</List.Item>
                    ))
                    }
                  </List>
                :
                  <InlineLoader text="No Data Found" />
              }
            </p>
          </Aux>
        </Modal.Content>
      </Modal>
    );
  }
}

export default TopThingsToKnowModal;
