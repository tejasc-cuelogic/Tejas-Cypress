import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { InlineLoader } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth < 992;
class IssuerStatement extends Component {
  handleViewGallary = (e, index) => {
    e.preventDefault();
    this.props.campaignStore.setFieldValue('gallarySelectedImageIndex', index);
    this.props.history.push(`${this.props.galleryUrl.replace(/\/$/, '')}/photogallery`);
  }

  render() {
    const { issuerStatement, newLayout } = this.props;
    return (
      <>
        <Header as="h3" className={`${newLayout && isTablet ? 'mb-20 mt-40' : newLayout ? 'mt-40 mb-30' : ''} anchor-wrap`}>
          Issuer Statement
          <span className="anchor" id="issuer-statement" />
        </Header>
        {issuerStatement
          ? (
            <p className="mb-40 copyright-info">
              <HtmlEditor readOnly content={(issuerStatement)} />
            </p>
          )
          : <InlineLoader text="No Data Found" className="bg-offwhite" />
        }
      </>
    );
  }
}

export default IssuerStatement;
