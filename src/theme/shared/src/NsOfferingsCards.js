import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import HtmlEditor from '../../../modules/shared/HtmlEditor';
import NSImage from '../../../modules/shared/NSImage';

export default class NsOfferingsCards extends React.Component {
  render() {
    const { offerings, isMobile } = this.props;
    return (
      <>
        <Card.Group itemsPerRow={isMobile ? 1 : 3}>
          {offerings.map(offering => (
            <Card className="bordered center-align investmentCards">
              {!isMobile
                ? (
                  <>
                    <NSImage path={offering.imageUrl} centered />
                    <Card.Content>
                      <Header as="h5">{offering.title}</Header>
                      <Card.Meta>
                        {offering.location}
                      </Card.Meta>
                      <Card.Description>
                        <HtmlEditor readOnly content={offering.description} />
                      </Card.Description>
                      <p><b>{offering.meta1}</b></p>
                      <p><b>{offering.meta2}</b></p>
                      <p className="more-info">{offering.offeredBy}</p>
                    </Card.Content>
                  </>
                )
                : (
                  <>
                    <NSImage path={offering.imageUrl} left />
                    <Card.Content>
                      <Header as="h5">{offering.title}</Header>
                      <Card.Description>
                        <HtmlEditor readOnly content={offering.meta1} />
                      </Card.Description>
                    </Card.Content>
                  </>
                )
              }
            </Card>
          ))}
        </Card.Group>
      </>
    );
  }
}
