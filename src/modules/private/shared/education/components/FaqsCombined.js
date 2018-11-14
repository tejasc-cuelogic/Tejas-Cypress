import React, { Component } from 'react';
import Aux from 'react-aux';
import { Input, Form, Accordion, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx';
import { InlineLoader } from '../../../../../theme/shared';

@inject('educationStore', 'userStore')
@observer
export default class FaqsCombined extends Component {
  state = { activeIndex: 0, innerActiveIndex: 0 }
  componentWillMount() {
    const props = { isMkt: this.props.marketing, params: this.props.params };
    const { currentUser } = this.props.userStore;
    let categoryType;
    if (this.props.params.for) {
      categoryType = this.props.params.for === 'investor' ? 'INV_FAQ' : 'ISSUER_FAQ';
    } else if (currentUser) {
      categoryType = toJS(currentUser.roles)[0] === 'investor' ? 'INV_TAX_FAQ' : 'ISSUER_OFFERING_CREATION_LEADERSHIP_FAQ';
    }
    this.props.educationStore.initRequest('Faq', props, categoryType);
  }
  toggleAccordion = (index, field) => {
    const newIndex = this.state[field] === index ? -1 : index;
    const stateChange = field === 'activeIndex' ? { activeIndex: newIndex, innerActiveIndex: 0 } : { innerActiveIndex: newIndex };
    this.setState(stateChange);
  }
  search = (e) => {
    this.props.educationStore.setSrchParam('Faq', e.target.value);
    if (this.props.location.pathname !== '/resources/education-center/investor/faq') {
      this.props.history.replace('/resources/education-center/investor/faq');
    }
  }
  render() {
    const { faqs, loading, searchParam } = this.props.educationStore;
    const { activeIndex, innerActiveIndex } = this.state;
    if (loading('Faq')) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          <Input
            fluid
            onChange={this.search}
            value={searchParam.Faq}
            inverted
            icon={{ className: 'ns-search' }}
            iconPosition="left"
            placeholder="Search by keyword or phrase"
          />
        </Form>
        <div className="mt-30">
          {faqs &&
          faqs.map((faq, key) => (
            <Accordion key={faq.id} className="faq-accordion" >
              <Accordion.Title active={activeIndex === key} index={key} onClick={() => this.toggleAccordion(key, 'activeIndex')}>
                {faq.categoryName}
                <Icon className="ns-chevron-down" />
              </Accordion.Title>
              <Accordion.Content active={activeIndex === key}>
                {faq.faqItems &&
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
                      <pre className="migrated-content" dangerouslySetInnerHTML={{ __html: faqItem.answer }} />
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
