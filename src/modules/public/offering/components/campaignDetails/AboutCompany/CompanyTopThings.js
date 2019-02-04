import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
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
        <Header as="h3" className="mt-10 mb-30 anchor-wrap">
          Company Description
          <span className="anchor" id="company-description" />
        </Header>
        {campaign && campaign.offering
          && campaign.offering.about
          && campaign.offering.about.theCompany ?
            <p className="detail-section">{Parser(campaign.offering.about.theCompany)}</p> :
            <InlineLoader text={emptyStatement} className="bg-offwhite" />
        }
      </Aux>
    );
  }
}

export default CompanyTopThings;
