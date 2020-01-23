import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Form, Accordion, Icon } from 'semantic-ui-react';
import { startsWith } from 'lodash';
import { FormInput, FormDropDown, FormCheckbox } from '../../../../../../../../theme/form';
import FormElementWrap from '../../../../../../../shared/businessApplication/components/FormElementWrap';
import { REGULATION_VALUES, BD_REGULATION_VALUES, FP_REGULATION_VALUES, BUSINESS_TYPE_VALUES } from '../../../../../../../../services/constants/admin/offerings';

@inject('businessAppReviewStore')
@observer
export default class BusinessApplicationMapping extends Component {
  state = { activeIndex: [0, 1] };

  constructor(props) {
    super(props);
    this.props.businessAppReviewStore.setFormData('APPLICATION_MAPPED_OFFERING_FORM');
  }

  toggleAccordianContent = (categoryIndex = null) => {
    const index = categoryIndex;
    const { activeIndex } = this.state;
    const newIndex = activeIndex;

    const currentIndexPosition = activeIndex.indexOf(index);
    if (currentIndexPosition > -1) {
      newIndex.splice(currentIndexPosition, 1);
    } else {
      newIndex.push(index);
    }

    this.setState({ activeIndex: newIndex });
  };

  render() {
    const { activeIndex } = this.state;
    const formName = 'APPLICATION_MAPPED_OFFERING_FORM';
    const {
      APPLICATION_MAPPED_OFFERING_FORM,
      formArrayChange,
      formChange,
    } = this.props.businessAppReviewStore;
    let MODIFIED_REGULATION_VALUES = null;
    if (APPLICATION_MAPPED_OFFERING_FORM && APPLICATION_MAPPED_OFFERING_FORM.fields && APPLICATION_MAPPED_OFFERING_FORM.fields.regulation
      && APPLICATION_MAPPED_OFFERING_FORM.fields.regulation.value) {
      MODIFIED_REGULATION_VALUES = startsWith(APPLICATION_MAPPED_OFFERING_FORM.fields.regulation.value, 'BD_') ? BD_REGULATION_VALUES : FP_REGULATION_VALUES;
    } else {
      MODIFIED_REGULATION_VALUES = REGULATION_VALUES;
    }
    return (
      <>
        <Form>
          <Header as="h4">Business Application Mapping</Header>
          <Accordion exclusive={false} fluid styled className="card-style mt-20">
            <Accordion.Title onClick={() => this.toggleAccordianContent(0)}>
              <Icon className={activeIndex.includes(0) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              Key Term
          </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(0)} className="categories-acc">
              <Form.Group widths={3}>
                <FormInput
                  key="businessName"
                  name="businessName"
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.businessName}
                  changed={(e, result) => formArrayChange(e, result, formName)}
                />
                <FormDropDown
                  // containerclassname={isReadonly ? 'display-only' : ''}
                  // className={isReadonly ? 'display-only' : ''}
                  // disabled={isReadonly}
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.businessEntityStructure}
                  selection
                  value={APPLICATION_MAPPED_OFFERING_FORM.fields.businessEntityStructure.value}
                  name="businessEntityStructure"
                  // placeholder={isReadonly ? 'N/A' : 'Choose here'}
                  placeholder="Choose here"
                  options={BUSINESS_TYPE_VALUES}
                  onChange={(e, result) => formArrayChange(e, result, formName)}
                />
                <FormDropDown
                  // containerclassname={isReadonly ? 'display-only' : ''}
                  // className={isReadonly ? 'display-only' : ''}
                  // disabled={isReadonly}
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.regulation}
                  selection
                  value={APPLICATION_MAPPED_OFFERING_FORM.fields.regulation.value}
                  name="regulation"
                  placeholder="Choose here"
                  options={MODIFIED_REGULATION_VALUES}
                  onChange={(e, result) => formArrayChange(e, result, formName)}
                />
              </Form.Group>
            </Accordion.Content>
          </Accordion>
          <Accordion exclusive={false} fluid styled className="card-style">
            <Accordion.Title onClick={() => this.toggleAccordianContent(1)}>
              <Icon className={activeIndex.includes(1) ? 'ns-chevron-up' : 'ns-chevron-down'} />
              Legal
          </Accordion.Title>
            <Accordion.Content active={activeIndex.includes(1)} className="categories-acc">
              <Form.Group widths={3}>
                {/* Legal Section Goes Here... */}
                {['website', 'number', 'street', 'city', 'state', 'zipCode'].map(field => (
                  <FormInput
                    // displayMode={isReadonly}
                    key={field}
                    name={field}
                    fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields[field]}
                    changed={(e, result) => formArrayChange(e, result, formName)}
                  />
                ))}
                <FormDropDown
                  // containerclassname={isReadonly ? 'display-only' : ''}
                  // className={isReadonly ? 'display-only' : ''}
                  // disabled={isReadonly}
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.companyTaxed}
                  selection
                  value={APPLICATION_MAPPED_OFFERING_FORM.fields.companyTaxed.value}
                  name="companyTaxed"
                  placeholder="Choose here"
                  options={APPLICATION_MAPPED_OFFERING_FORM.fields.companyTaxed.values}
                  onChange={(e, result) => formArrayChange(e, result, formName)}
                />
              </Form.Group>
              <FormElementWrap
                noDivider
                header="Use of Proceeds"
              >
                <FormCheckbox
                  // disabled={preQualFormDisabled}
                  fielddata={APPLICATION_MAPPED_OFFERING_FORM.fields.fundUsage}
                  name="fundUsage"
                  changed={(e, result) => formChange(e, result, formName)}
                  defaults
                  containerclassname="ui relaxed list"
                />
              </FormElementWrap>

            </Accordion.Content>
          </Accordion>
        </Form>
      </>
    );
  }
}
