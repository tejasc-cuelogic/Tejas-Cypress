import React, { Component } from 'react';
import { Header, Grid, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';

class CompanyTopThings extends Component {
  render() {
    const {
      campaign, companyDescriptionUrl, emptyStatement,
    } = this.props;
    return (
      <Grid.Column widescreen={7} largeScreen={8} computer={16} tablet={16}>
        <Segment padded>
          {/* <Breadcrumb>
                  <Breadcrumb.Section as={Link}to={`${this.props.match.url}/companydescription`}>
                  <b>Company Description</b></Breadcrumb.Section>
                  <Breadcrumb.Divider icon={{ className: 'ns-chevron-right', color: 'green' }} />
                </Breadcrumb>
                <Header as="h3">Top things to know</Header> */}
          <Header as="h3">
            <Link to={`${companyDescriptionUrl}/companydescription`}>
              Top things to know
              <Icon className="ns-chevron-right" color="green" />
            </Link>
          </Header>
          {
            campaign.offering.about.theCompany !== null ?
              <Aux>
                <p
                  dangerouslySetInnerHTML={
                    {
                      __html: campaign && campaign.offering
                        && campaign.offering.about
                        && campaign.offering.about.theCompany,
                    }
                  }
                />
                <Link to={`${companyDescriptionUrl}/companydescription`}>Read More</Link>
              </Aux>
              :
              <p>{emptyStatement}</p>
          }
        </Segment>
      </Grid.Column>
    );
  }
}

export default CompanyTopThings;
