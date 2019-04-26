/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import Aux from 'react-aux';
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
      clearable
      options={props.options}
    />
    <div className="dropdown-effect">{props.label || props.name}</div>
  </Form.Field>
);

export const DropdownFilterWithHeader = props => (
  <Form.Field className="dropdown-field">
    <label>{props.label || props.name}</label>
    {
      props.options && props.options !== null ?
        <Dropdown
          text={props.value || 'Select Filter'}
          floating
          labeled
          className={props.className}
          name={props.keyName || camelCase(props.name)}
          onChange={props.change}
          value={toJS(props.value) || ((props.isMultiple) ? [] : '')}
          placeholder={props.placeHolder || 'Select Filter'}
          selection
        >
          <Dropdown.Menu>
            {_.map(props.options, (rec, index) => (
              <Aux>
                <Dropdown.Header content={index} key={index} />
                <Dropdown.Divider />
                {
                  rec.map(el => (
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
              </Aux>
            ))}
          </Dropdown.Menu>
        </Dropdown> : null
    }

    <div className="dropdown-effect">{props.label || props.name}</div>
  </Form.Field>
);

export const ByKeyword = ({
  w, executeSearch, placeholder, fLabel, requestState, toggleSearch, filters, addon,
  more, enableSearch, change,
}) => (
  <Aux>
    <Grid.Column widescreen={w[0]} largeScreen={w[0]} computer={w[1]} tablet={w[1]} mobile={w[1]}>
      <Form>
        <Form.Field inverted>
          {fLabel && <label className="invisible">{placeholder}</label>}
          {!enableSearch &&
          <Input fluid onChange={change} onKeyPress={executeSearch} inverted icon={{ className: 'ns-search' }} iconPosition="left" placeholder={placeholder} />}
        </Form.Field>
      </Form>
    </Grid.Column>
    {more !== 'no' &&
      <Grid.Column width={3} textAlign="center">
        <span className="filter-count">{requestState && requestState.search ? Object.keys(requestState.search).length : 0}</span>
        <Button icon color="blue" onClick={toggleSearch} className="link-button">
          {filters ? <Aux>Hide Filters <Icon className="ns-caret-up" /></Aux> :
          <Aux>Show Filters <Icon className="ns-caret-down" /></Aux>
          }
        </Button>
      </Grid.Column>
    }
    {addon}
  </Aux>
);

export const DateRangeFilter = props => (
  <Form.Field>
    <label>{props.label}</label>
    <Form.Group widths="equal" className="range">
      <Form.Field>
        <NumberFormat
          value={props.startDate}
          type="text"
          format="##-##-####"
          placeholder="MM-DD-YYYY"
          onValueChange={values => props.change(values, props.nameStart || 'startDate')}
        />
      </Form.Field>
      <Form.Field>
        <NumberFormat
          value={props.endDate}
          type="text"
          format="##-##-####"
          placeholder="MM-DD-YYYY"
          onValueChange={values => props.change(values, props.nameEnd || 'endDate')}
        />
      </Form.Field>
    </Form.Group>
  </Form.Field>
);

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
