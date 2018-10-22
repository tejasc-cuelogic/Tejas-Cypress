import React, { Component } from 'react';
import { Header, Icon, Grid, Segment, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { filter } from 'lodash';
import { INDUSTRY_TYPES } from '../../../../../../constants/offering';

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
      <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
        <Segment padded>
          {/* <Breadcrumb>
            <Breadcrumb.Section as={Link}
            to={`${refLink}/about`}><b>About the Company</b></Breadcrumb.Section>
            <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
          </Breadcrumb>
          <Header as="h3">Top things to know</Header> */}
          <div className="segment-container small">
            <Header as="h3">
              <Link to={`${refLink}/overview/details`}>
                Top Things to Know
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
            <p>
              <b>Industry: </b>
              {campaign && campaign.keyTerms && INDUSTRY_TYPES[campaign.keyTerms.industry]}<br />
              <b>Investment Type: </b>
              {campaign && campaign.selectedOffer && campaign.selectedOffer.structure}
              <Popup hoverable position="bottom center" trigger={<Icon name="help circle" color="green" />} content={(<span>For every $100 you invest, you are paid a portion of this company&apos;s gross revenue every month until you are paid $190 within 78 months. A 1.0% service fee is deducted from each payment. <a target="blank" href="https://www.nextseed.com/offerings/buffbrew-taproom/#returnsGraphAnchor">See some examples</a>.</span>)} />
            </p>
            <p className="detail-section" dangerouslySetInnerHTML={{ __html: campaign && campaign.offering && campaign.offering.about && campaign.offering.about.theCompany }} />
          </div>
          <Link to={`${this.props.refLink}/about`}>Read More</Link>
          {
            filteredSocialArr.length ?
              <div className="mt-50">
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
