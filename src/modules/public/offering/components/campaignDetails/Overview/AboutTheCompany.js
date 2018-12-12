import React, { Component } from 'react';
import { Header, Icon, Grid, Segment, Popup, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { filter } from 'lodash';
import { INDUSTRY_TYPES, CAMPAIGN_KEYTERMS_REGULATION } from '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';

class AboutTheCompany extends Component {
  render() {
    const { campaign, refLink } = this.props;
    const socialArray = campaign && campaign.offering && campaign.offering.overview &&
      campaign.offering.overview.social &&
      campaign.offering.overview.social.length ? campaign.offering.overview.social : [];
    const filteredSocialArr = filter(socialArray, o => (
      o.url
    ));
    return (
      <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16}>
        <Segment padded>
          <div className="segment-container small">
            <Header as="h3">
              <Link to={`${refLink}/overview/top-things-to-know`}>
                Top Things to Know
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
            <p className="mb-0 neutral-text">
              <b>Type of Raise: </b>
              {campaign && campaign.keyTerms && campaign.keyTerms.regulation ? CAMPAIGN_KEYTERMS_REGULATION[campaign.keyTerms.regulation] : ''}
              <Popup hoverable position="bottom center" trigger={<Icon name="help circle" color="green" />} content={(<span>For every $100 you invest, you are paid a portion of this company&apos;s gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. <a target="blank" href="https://www.nextseed.com/offerings/buffbrew-taproom/#returnsGraphAnchor">See some examples</a>.</span>)} />
            </p>
            <p className="neutral-text">
              <b>Industry: </b>
              {campaign && campaign.keyTerms && INDUSTRY_TYPES[campaign.keyTerms.industry]}
            </p>
            {campaign && campaign.offering && campaign.offering.overview &&
              campaign.offering.overview.elevatorPitch &&
              <div className="detail-section mt-10" dangerouslySetInnerHTML={{ __html: campaign.offering.overview.elevatorPitch }} />
            }
            {campaign && campaign.offering && campaign.offering.overview &&
              campaign.offering.overview.highlight ?
                <List bulleted>
                  {campaign.offering.overview.highlight.map(field => (
                    <List.Item className="mb-half">{field}</List.Item>
                  ))
                  }
                </List>
              :
                <InlineLoader text="No Data Found" />
            }
          </div>
          {campaign && campaign.offering && campaign.offering.overview &&
            campaign.offering.overview.highlight &&
            campaign.offering.overview.highlight.length > 6 ?
              <Link to={`${this.props.refLink}/overview/top-things-to-know`}>Read More</Link>
            :
            null}
          {
            filteredSocialArr.length ?
              <div className="mt-40">
                {filteredSocialArr.map(socalObj => (
                  socalObj.url && socalObj.url !== '' &&
                  <a href={`https://${socalObj.url}`} target="_blank" rel="noopener noreferrer" className="icon-link mr-10">
                    <Icon color="grey" name={socalObj.type} />
                  </a>
                ))
                }
              </div>
              :
              ''
          }
        </Segment>
      </Grid.Column>
    );
  }
}

export default AboutTheCompany;
