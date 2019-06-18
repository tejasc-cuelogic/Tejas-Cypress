import React, { Component } from 'react';
import { Header, List, Button, Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { InlineLoader } from '../../../../../../theme/shared';

const isTablet = document.documentElement.clientWidth < 991;

@withRouter
class AboutTheCompany extends Component {
  handleViewAboutCompany = (e) => {
    e.preventDefault();
    this.props.history.push(`${this.props.refLink}/about`);
  }

  render() {
    const { campaign } = this.props;
    const elevatorPitch = (campaign && campaign.offering && campaign.offering.overview
      && campaign.offering.overview.elevatorPitch)
      || (campaign && campaign.offering && campaign.offering.overview
      && campaign.offering.overview.highlight);
    return (
      <>
        <Header as="h3" className="mt-20 mb-30 anchor-wrap">
          Top Things to Know
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
                        <List.Item className="mb-half">{field}</List.Item>
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
        <Button fluid={isTablet} onClick={this.handleViewAboutCompany} basic compact className="highlight-text mt-40">
          Learn More About the Company
          <Icon size="small" className="ns-chevron-right right" color="white" />
        </Button>
      </>
    );
  }
}

export default AboutTheCompany;
