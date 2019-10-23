/*  eslint-disable jsx-a11y/label-has-for */
import React, { useState } from 'react';
import { toJS } from 'mobx';
import { Grid, Input, Dropdown, Form, Label, Icon, List, Button } from 'semantic-ui-react';
import moment from 'moment';
import camelCase from 'lodash/camelCase';
import startCase from 'lodash/startCase';
import _ from 'lodash';
import NumberFormat from 'react-number-format';


export const DropdownFilter = props => (
  <Form.Field className="dropdown-field">
    <label>{props.label || props.name}</label>
    <Dropdown
      name={props.keyName || camelCase(props.name)}
      onChange={props.change}
      className={props.className}
      value={toJS(props.value) || ((props.isMultiple) ? [] : '')}
      placeholder={props.placeHolder || 'Select Filter'}
      fluid
      multiple={props.isMultiple}
      selection
      options={props.options}
    />
    <div className="dropdown-effect">{props.label || props.name}</div>
  </Form.Field>
);

export const DropdownFilterWithHeader = props => (
  <Form.Field className="dropdown-field">
    <label>{props.label || props.name}</label>
    {
      props.options && props.options !== null
        ? (
<Dropdown
  text={props.value || 'Select Filter'}
  className={props.className}
  name={props.keyName || camelCase(props.name)}
  onChange={props.change}
  value={toJS(props.value) || ((props.isMultiple) ? [] : '')}
  placeholder={props.placeHolder || 'Select Filter'}
  selection
>
          <Dropdown.Menu>
            {_.map(props.options, rec => (
              <>
                {rec.title
                  ? (
<>
                    <Dropdown.Header content={rec.title} key={rec.title} />
                    <Dropdown.Divider />
                  </>
                  ) : ''}
                {
                  rec.options.map(el => (
                    <Dropdown.Item
                      key={el.value}
                      name={props.keyName || camelCase(props.name)}
                      onClick={e => props.change(e, { name: props.keyName, value: el.value })}
                      value={el.value}
                      active={el.value === props.value}
                    >{el.text}
                    </Dropdown.Item>
                  ))
                }
              </>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        ) : null
    }

    <div className="dropdown-effect">{props.label || props.name}</div>
  </Form.Field>
);

export const ByKeyword = ({
  w, executeSearch, placeholder, fLabel, requestState, toggleSearch, filters, addon, filterCount,
  more, enableSearch, change, addLabel, name, showLabel,
}) => (
  <>
    <Grid.Column widescreen={w[0]} largeScreen={w[0]} computer={w[1]} tablet={w[1]} mobile={w[1]}>
      <Form>
        <Form.Field inverted>
          {addLabel ? <label>{addLabel || addLabel}</label> : ''}
          {fLabel && <label className={showLabel ? '' : 'invisible'}>{placeholder}</label>}
          {!enableSearch
          && <Input fluid onChange={change} name={name} onKeyPress={executeSearch} inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder={placeholder} />}
        </Form.Field>
      </Form>
    </Grid.Column>
    {more !== 'no'
      && (
<Grid.Column width={3} textAlign="center">
        <span className="filter-count">{requestState && requestState.search ? filterCount !== undefined ? filterCount : Object.keys(requestState.search).length : 0}</span>
        <Button icon color="blue" onClick={toggleSearch} className="link-button">
          {filters ? <>Hide Filters <Icon className="ns-caret-up" /></>
            : <>Show Filters <Icon className="ns-caret-down" /></>
          }
        </Button>
      </Grid.Column>
      )
    }
    {addon}
  </>
);

export const DateRangeFilter = (props) => {
  const [errorObj, setError] = useState({});
  const startDate = props.startDate || props.filters.startDate;
  const endDate = props.endDate || props.filters.endDate;
  window.momentLib = moment;
  const IsStartDateBeforeEndDate = (val, field) => ((moment(field === (props.nameStart || 'startDate') ? val : startDate).isValid() && moment(field === (props.nameEnd || 'endDate') ? val : endDate).isValid())
    && !(moment(field === (props.nameStart || 'startDate') ? val : startDate).isBefore(moment(field === (props.nameEnd || 'endDate') ? val : endDate))));

  const validateDate = (values, fieldName, isEndDate = false) => {
    const year = moment(values.formattedValue, 'MM-DD-YYYY', true).year();
    if (moment(values.formattedValue, 'MM/DD/YYYY').isValid() && year < 1950) {
      setError({ fieldName, error: 'Date year should be greater or equal to 1950' });
    } else if (isEndDate && year > 1950 && moment(values.formattedValue, 'MM/DD/YYYY').isValid() && !moment(values.formattedValue, 'MM/DD/YYYY').isSameOrBefore(moment())) {
      setError({ fieldName, error: 'Date should not be greater than Today`s date' });
    } else if (IsStartDateBeforeEndDate(values.formattedValue, fieldName)) {
      setError({ error: 'Start Date should not be greater than End date' });
    } else {
      setError('');
      props.change(values, fieldName);
    }
  };
  return (
    <Form.Field>
      <label>{props.label}</label>
      <Form.Group widths="equal" className="range">
        <Form.Field className={errorObj.fieldName === (props.nameStart || 'startDate') ? 'error' : ''}>
          <NumberFormat
            value={props.startDate}
            type="text"
            format="##-##-####"
            className={errorObj.fieldName === (props.nameStart || 'startDate') ? 'error' : ''}
            placeholder="MM-DD-YYYY"
            onValueChange={values => validateDate(values, props.nameStart || 'startDate')}
          />
        </Form.Field>
        <Form.Field className={errorObj.fieldName === (props.nameEnd || 'endDate') ? 'error' : ''}>
          <NumberFormat
            className={errorObj.fieldName === (props.nameEnd || 'endDate') ? 'error' : ''}
            value={props.endDate}
            type="text"
            format="##-##-####"
            placeholder="MM-DD-YYYY"
            onValueChange={values => validateDate(values, props.nameEnd || 'endDate', true)}
          />
        </Form.Field>
      </Form.Group>
      {errorObj.error && (
      <p className="negative-text">{errorObj.error || ''}</p>
      )}
    </Form.Field>
  );
};

export const AmountRangeFilter = props => (
  <Form.Field>
    <label>{props.label}</label>
    <Form.Group widths="equal" className="range">
      <Form.Field>
        <NumberFormat
          prefix="$ "
          maxLength="10"
          thousandSeparator
          placeholder={props.placeHolderMin || 'Min Amount'}
          currency
          onBlur={e => props.change(e, props.nameMin || 'min')}
        />
      </Form.Field>
      <Form.Field>
        <NumberFormat
          prefix="$ "
          maxLength="10"
          thousandSeparator
          placeholder={props.placeHolderMax || 'Max Amount'}
          currency
          onBlur={e => props.change(e, props.nameMax || 'max')}
        />
      </Form.Field>
    </Form.Group>
  </Form.Field>
);

export const AppliedFilters = (props) => {
  const data = { ...props.filters };
  if (data.startDate && data.endDate) {
    const startDate = moment(data.startDate).format('MM-DD-YYYY');
    const endDate = moment(data.startDate).format('MM-DD-YYYY');
    data.creationDate = `${startDate} - ${endDate}`;
  }
  delete data.startDate;
  delete data.endDate;
  const filterKeys = Object.keys(data);
  if (filterKeys.length < 1) {
    return <List.Item as="a" to="">No filters applied.</List.Item>;
  }
  return (
    <span>
      {
        filterKeys.map(f => (
          <Label key={f} as="a">
            {`${startCase(f)}: ${data[f]}`}
            <Icon name="delete" onClick={() => props.click(f)} />
          </Label>
        ))
      }
    </span>
  );
};
