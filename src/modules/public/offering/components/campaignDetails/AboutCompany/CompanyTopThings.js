import React, { Component } from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
// import Aux from 'react-aux';
import { InlineLoader } from '../../../../../../theme/shared';

class CompanyTopThings extends Component {
  render() {
    const {
      campaign, companyDescriptionUrl, emptyStatement,
    } = this.props;
    return (
      <Grid.Column widescreen={6} largeScreen={6} computer={16} tablet={16}>
        <Segment padded>
          {/* <Breadcrumb>
                  <Breadcrumb.Section as={Link}to={`${this.props.match.url}/companydescription`}>
                  <b>Company Description</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h3">Top things to know</Header> */}
          <div className="segment-container small">
            <Header as="h3">
              <Link to={`${companyDescriptionUrl}/companydescription`}>
                Company Description
                <Icon className="ns-chevron-right" color="green" />
              </Link>
            </Header>
            <p>{`Text Len==> ${campaign.offering.about.theCompany.length}`}</p>
            {campaign && campaign.offering
              && campaign.offering.about
              && campaign.offering.about.theCompany ?
                <p
                  dangerouslySetInnerHTML={
                    {
                      __html: campaign.offering.about.theCompany,
                    }
                  }
                />
                :
                <InlineLoader text={emptyStatement} />
              }
          </div>
          <Link to={`${companyDescriptionUrl}/companydescription`}>Read More</Link>
        </Segment>
      </Grid.Column>
    );
  }
}

export default CompanyTopThings;
