import React, { Component } from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
// import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../theme/shared';

const isSmallscreen = document.documentElement.clientWidth >= 1200
  && document.documentElement.clientWidth <= 1440;
class CompanyTopThings extends Component {
  render() {
    const {
      campaign, companyDescriptionUrl, emptyStatement,
    } = this.props;
    const textContentMaxLength = isSmallscreen ? 280 : 1075;
    return (
      <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16}>
        <Segment padded>
          {/* <Breadcrumb>
                  <Breadcrumb.Section as={Link}to={`${this.props.match.url}/company-description`}>
                  <b>Company Description</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h3">Top things to know</Header> */}
          <div className={`segment-container ${!isSmallscreen && 'small'}`}>
            <Header as="h3">
              <Link to={`${companyDescriptionUrl}/company-description`}>
                Company Description
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
            {/* <p>{`Text Conten Len==> ${campaign.offering.about.theCompany.length}`}</p> */}
            {campaign && campaign.offering
              && campaign.offering.about
              && campaign.offering.about.theCompany ?
                <p
                  dangerouslySetInnerHTML={{
                  __html: campaign.offering.about.theCompany.length <= textContentMaxLength ?
                    campaign.offering.about.theCompany
                    :
                    campaign.offering.about.theCompany.substring(1, textContentMaxLength),
                }}
                />
              :
                    <InlineLoader text={emptyStatement} />
            }
          </div>
          {campaign && campaign.offering
            && campaign.offering.about
            && campaign.offering.about.theCompany &&
            campaign.offering.about.theCompany.length &&
            campaign.offering.about.theCompany.length > textContentMaxLength &&
            <Link to={`${companyDescriptionUrl}/company-description`}>Read More</Link>
          }
        </Segment>
      </Grid.Column >
    );
  }
}

export default CompanyTopThings;
