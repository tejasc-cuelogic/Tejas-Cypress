import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
// import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { InlineLoader } from '../../../../../../theme/shared';

class CompanyTopThings extends Component {
  render() {
    const {
      campaign, emptyStatement,
    } = this.props;
    return (
      <Aux>
        <Header as="h3">Company Description</Header>
        {campaign && campaign.offering
          && campaign.offering.about
          && campaign.offering.about.theCompany ?
            <p className="detail-section">
              {Parser(campaign.offering.about.theCompany)}
            </p>
          :
            <InlineLoader text={emptyStatement} />
        }
        {/* {campaign && campaign.offering
          && campaign.offering.about
          && campaign.offering.about.theCompany &&
          campaign.offering.about.theCompany.length &&
          campaign.offering.about.theCompany.length > textContentMaxLength &&
          <Link to={`${companyDescriptionUrl}/company-description`}>Read More</Link>
        } */}
      </Aux>
    );
  }
}

export default CompanyTopThings;
