import React, { Component } from 'react';
import Aux from 'react-aux';
import { Header } from 'semantic-ui-react';
import HtmlEditor from '../../../../../../modules/shared/HtmlEditor';

class IssuerStatement extends Component {
  handleViewGallary = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl.replace(/\/$/, '')}/photogallery`);
  }
  render() {
    const { campaign } = this.props;
    const offeirngDisclaimer = campaign && campaign.keyTerms &&
      campaign.keyTerms.offeringDisclaimer ?
      campaign.keyTerms.offeringDisclaimer : null;
    // const shorthandBusinessName = campaign && campaign.keyTerms &&
    //   campaign.keyTerms.shorthandBusinessName ?
    //   campaign.keyTerms.shorthandBusinessName : '';
    return (
      <Aux>
        <Header as="h3" className="anchor-wrap">
          Issuer Statement
          <span className="anchor" id="issuer-statement" />
        </Header>
        <p className="mb-40 copyright-info">
          {/* <b>{`${shorthandBusinessName} Disclaimer: `}</b> */}
          <HtmlEditor readOnly content={(offeirngDisclaimer)} />
        </p>
      </Aux>
    );
  }
}

export default IssuerStatement;
