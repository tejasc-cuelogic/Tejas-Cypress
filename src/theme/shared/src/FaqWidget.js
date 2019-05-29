import React from 'react';
import Aux from 'react-aux';
import { Card, Header, Accordion, Icon } from 'semantic-ui-react';

class FaqWidget extends React.Component {
  state = { activeIndex: 0 };

  toggleAction = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { faqs, heading, fullHeading } = this.props;
    const { activeIndex } = this.state;
    if (faqs) {
      return (
        <Card fluid>
          <Card.Content>
            <Header as="h4">{fullHeading || `${heading} FAQs`}</Header>
            <Accordion className="faq-acc">
              {
                faqs.map(faq => (
                  <Aux key={faq.id}>
                    <Accordion.Title
                      active={activeIndex === faq.id}
                      index={faq.id}
                      onClick={this.toggleAction}
                    >
                      <Icon name="dropdown" />{faq.title}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === faq.id}>
                      <p>{faq.description}</p>
                    </Accordion.Content>
                  </Aux>
                ))
              }
            </Accordion>
          </Card.Content>
        </Card>
      );
    }
    return null;
  }
}

export default FaqWidget;
