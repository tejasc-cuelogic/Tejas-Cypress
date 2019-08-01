import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import HtmlEditor from '../../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 992;


class CompanyTopThings extends Component {
  render() {
    const {
      campaign, emptyStatement,
    } = this.props;
    return (
      <>
        <Header as="h3" className={`${(this.props.newLayout && isMobile) ? 'mt-40 mb-20' : this.props.newLayout ? 'mt-40 mb-30' : 'mt-20 mb-30'} anchor-wrap`}>
          Company Description
          <span className="anchor" id="company-description" />
        </Header>
        {campaign && campaign.offering
          && campaign.offering.about
          && campaign.offering.about.theCompany
          ? <p className="detail-section"><HtmlEditor readOnly content={campaign.offering.about.theCompany} /></p>
          : <InlineLoader text={emptyStatement} className="bg-offwhite" />
        }
      </>
    );
  }
}

export default CompanyTopThings;
