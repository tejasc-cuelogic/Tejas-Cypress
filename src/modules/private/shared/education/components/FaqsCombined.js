import React, { Component } from 'react';
import Aux from 'react-aux';
import { Input, Form, Accordion, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('educationStore')
@observer
export default class FaqsCombined extends Component {
  state = { activeIndex: 0, innerActiveIndex: 0 }
  componentWillMount() {
    const props = { isMkt: this.props.marketing, params: this.props.params };
    this.props.educationStore.initRequest('Faq', props);
  }
  toggleAccordion = (index, field) => {
    const newIndex = this.state[field] === index ? -1 : index;
    const stateChange = field === 'activeIndex' ? { activeIndex: newIndex, innerActiveIndex: 0 } : { innerActiveIndex: newIndex };
    this.setState(stateChange);
  }
  render() {
    const { faqs } = this.props.educationStore;
    const { activeIndex, innerActiveIndex } = this.state;
    return (
      <Aux>
        <Form>
          <Input icon="search" placeholder="Search" fluid />
        </Form>
        <div className="mt-30">
          {faqs &&
          faqs.map((faq, key) => (
            <Accordion key={faq.id} className="faq-accordion" >
              <Accordion.Title active={activeIndex === key} index={key} onClick={() => this.toggleAccordion(key, 'activeIndex')}>
                {faq.question}
                <Icon className="ns-chevron-down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === key}>
                {faq.faqItems && faq.faqItems.length &&
                faq.faqItems.map((faqItem, index) => (
                  <Accordion key={faqItem.id}>
                    <Accordion.Title
                      active={innerActiveIndex === index}
                      index={index}
                      onClick={() => this.toggleAccordion(index, 'innerActiveIndex')}
                    >
                      <Icon className={innerActiveIndex === index ? 'ns-minus-square' : 'ns-plus-square'} color="green" />
                      {faqItem.question}
                    </Accordion.Title>
                    <Accordion.Content active={innerActiveIndex === index}>
                      {faqItem.answer} 
                    </Accordion.Content>
                  </Accordion>
                ))
                }
              </Accordion.Content>
            </Accordion>
          ))
          }
          <p className="note mt-30">
          If you still have questions, please don’t hesitate to contact us
          at <a href="mailto:apply@nextseed.com" className="link">info@nextseed.com</a>
          </p>
        </div>
      </Aux>
    );
  }
}
