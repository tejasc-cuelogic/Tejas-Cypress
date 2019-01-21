import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header, List, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
// import { filter } from 'lodash';
import Parser from 'html-react-parser';
// import { INDUSTRY_TYPES, CAMPAIGN_KEYTERMS_REGULATION } from
// '../../../../../../constants/offering';
import { InlineLoader } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@withRouter
class AboutTheCompany extends Component {
  handleViewAboutCompany = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/about`);
  }
  render() {
    const { campaign } = this.props;
    // const socialArray = campaign && campaign.offering && campaign.offering.overview &&
    //   campaign.offering.overview.social &&
    //   campaign.offering.overview.social.length ? campaign.offering.overview.social : [];
    // const filteredSocialArr = filter(socialArray, o => (
    //   o.url
    // ));
    return (
      <Aux>
        <Header as="h3" className="mb-30" id="top-things-to-know">Top Things to Know</Header>
        {/* <p className="mb-0 neutral-text">
          <b>Type of Raise: </b>
          {campaign && campaign.keyTerms && campaign.keyTerms.regulation ?
            CAMPAIGN_KEYTERMS_REGULATION[campaign.keyTerms.regulation] : ''}
          <Popup hoverable position="bottom center" trigger={<Icon name="help circle"
          color="green" />} content={(<span>This campaign is raising capital under
            Regulation CF and Regulation D. For more information on what this means,
            check out our <Link to="/resources/education-center">Education Center</Link>.
            </span>)} />
        </p>
        <p className="neutral-text">
          <b>Industry: </b>
          {campaign && campaign.keyTerms && INDUSTRY_TYPES[campaign.keyTerms.industry]}
        </p> */}
        {campaign && campaign.offering && campaign.offering.overview &&
          campaign.offering.overview.elevatorPitch &&
          <div className="detail-section mt-10">
            {Parser(campaign.offering.overview.elevatorPitch)}
          </div>
        }
        {campaign && campaign.offering && campaign.offering.overview &&
          campaign.offering.overview.highlight ?
            <List bulleted relaxed="very">
              {campaign.offering.overview.highlight.map(field => (
                <List.Item className="mb-half">{field}</List.Item>
              ))
              }
            </List>
          :
            <InlineLoader text="No Data Found" />
        }
        <Button fluid={isMobile} onClick={this.handleViewAboutCompany} basic compact className="highlight-text mt-40">
          Learn More About the Company
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
        {/* {campaign && campaign.offering && campaign.offering.overview &&
          campaign.offering.overview.highlight &&
          campaign.offering.overview.highlight.length > 6 ?
            <Link to={`${this.props.refLink}/overview/top-things-to-know`}>Read More</Link>
          :
          null} */}
        {/* {
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
          } */}
      </Aux>
    );
  }
}

export default AboutTheCompany;
