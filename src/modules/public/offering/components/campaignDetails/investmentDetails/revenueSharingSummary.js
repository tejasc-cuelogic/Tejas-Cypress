import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { InlineLoader, IframeModal } from '../../../../../../theme/shared';
import { UPLOADS_CONFIG } from '../../../../../../constants/aws';

class revenueSharingSummary extends Component {
  handleViewGallary = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl.replace(/\/$/, '')}/photogallery`);
  }

  render() {
    const { newLayout } = this.props;
    const {
      campaign,
    } = this.props.campaignStore;
    const keyterms = campaign.keyTerms;
    const revenueShareSummary = keyterms.revShareSummary || null;
    return (
        <>
        <Header as="h3" className="mb-40 mt-40 anchor-wrap">
        Revenue Sharing Summary
        <span className="anchor" id="revenue-sharing-summary" />
      </Header>
      {revenueShareSummary
        ? (
<p className="detail-section">
          <HtmlEditor readOnly content={revenueShareSummary} />
          {newLayout && get(keyterms, 'revShareSummaryUpload')
          && (
            <section className="custom-segment padded center-align mt-30">
            <Header as="h4" className="anchor-wrap">How do Revenue Sharing Notes work?</Header>
            <span>See our Infographic for a detailed explaination</span>
            <div>
            <IframeModal isPdf srcUrl={`https://${UPLOADS_CONFIG.bucket}/${get(keyterms, 'revShareSummaryUpload').url}`} trigger={<Button compact className="primary mt-20 relaxed" content="View" />} />
            </div>
            </section>
          )
          }
        </p>
        )
        : <InlineLoader text="No data available" className="bg-offwhite" />
      }
      </>
    );
  }
}

export default revenueSharingSummary;
