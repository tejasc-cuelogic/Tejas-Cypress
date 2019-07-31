import React, { Component } from 'react';
import { Header, List, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { InlineLoader } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth < 992;

@withRouter
class AboutTheCompany extends Component {
  handleViewAboutCompany = (e) => {
    e.preventDefault();
    const url = this.props.newLayout ? '#company-description' : '/about';
    this.props.history.push(`${this.props.refLink}${url}`);
  }

  render() {
    const { campaign, newLayout } = this.props;
    const elevatorPitch = (campaign && campaign.offering && campaign.offering.overview
      && campaign.offering.overview.elevatorPitch)
      || (campaign && campaign.offering && campaign.offering.overview
      && campaign.offering.overview.highlight);
    return (
      <>
        <Header as="h3" className={`mt-20 anchor-wrap ${newLayout && isTablet ? 'mb-20' : 'mb-30'}`}>
          {newLayout ? 'Highlights' : 'Top Things to Know'}
          <span className="anchor" id="top-things-to-know" />
        </Header>
        {
          elevatorPitch
            ? (
              <>
                {campaign && campaign.offering && campaign.offering.overview
                && campaign.offering.overview.elevatorPitch
                && (
<div className="detail-section mt-10">
                  <HtmlEditor readOnly content={campaign.offering.overview.elevatorPitch} />
                </div>
                )
              }
              {campaign && campaign.offering && campaign.offering.overview
                && campaign.offering.overview.highlight
                ? (
<List bulleted relaxed="very">
                    {campaign.offering.overview.highlight.map(field => (
                      <List.Item className={newLayout ? 'mb-14 pt-0 pb-0' : 'mb-half'}>{field}</List.Item>
                    ))
                    }
                  </List>
                )
                : null
              }
              </>
            )
            : <InlineLoader className="bg-offwhite" text="No data found." />
        }
        {!newLayout
        && (
        <Button fluid={isTablet} onClick={this.handleViewAboutCompany} basic={!newLayout} compact={!newLayout} className={`${newLayout ? 'link-button mt-20' : 'mt-40'} highlight-text`}>
          Learn More About the Company
          <Icon size={newLayout ? '' : 'small'} className={`${newLayout ? 'ns-caret-down' : 'ns-chevron-right'} right`} color="white" />
        </Button>
        )
        }
      </>
    );
  }
}

export default AboutTheCompany;
