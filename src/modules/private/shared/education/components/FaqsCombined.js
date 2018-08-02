import React, { Component } from 'react';
import Aux from 'react-aux';
import { Input, Form, Accordion, Icon } from 'semantic-ui-react';

export default class FaqsCombined extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Aux>
        <Form>
          <Input icon="search" placeholder="Search" />
        </Form>
        <section>
          <Accordion className="faq-accordion" >
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
              Investor Qualification
              <Icon className="ns-chevron-down" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Accordion>
                <Accordion.Title active>
                  <Icon name="add square" color="green" />
                  Who can invest on NextSeed?
                </Accordion.Title>
                <Accordion.Content active>
                Anyone over the age of 18 with a U.S. social security number or tax identification
                number and U.S. residential address can make investments on NextSeed. This is
                because you’ll need to open an investment account at our partner U.S. bank to make
                investments and receive any payments from businesses.  
                </Accordion.Content>
              </Accordion>
            </Accordion.Content>
          </Accordion>
        </section>
      </Aux>
    );
  }
}
