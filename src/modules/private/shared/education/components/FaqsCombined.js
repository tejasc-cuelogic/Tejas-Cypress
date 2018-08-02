import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
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
          <Input icon="search" placeholder="Search" fluid />
        </Form>
        <div className="mt-30">
          <Accordion className="faq-accordion" >
            <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
              Investor Qualification
              <Icon className="ns-chevron-down" />
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <Accordion>
                <Accordion.Title active>
                  <Icon className="ns-minus-square" color="green" />
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
          <p className="note mt-30">
          If you still have questions, please don’t hesitate to contact us
          at <Link to="/">info@nextseed.com</Link>
          </p>
        </div>
      </Aux>
    );
  }
}
