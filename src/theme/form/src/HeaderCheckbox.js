/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { List, Checkbox, Header } from 'semantic-ui-react';

const HeaderCheckbox = observer((props) => {
  const {
    label, values, value,
  } = props.fielddata;
  const { header, subheader, changed } = props;
  return (
    <div className={props.containerclassname || false}>
      {
        values.length > 0
          ? values.map(c => (
            <List.Item className="ui checkbox">
              <Checkbox
                checked={value.includes(c.value)}
                value={c.value}
                label={(
                  <label>
                    <Header as="h4">
                      {header}
                      <Header.Subheader>
                        {subheader}
                      </Header.Subheader>
                    </Header>
                  </label>
)}
                onChange={changed}
              />
            </List.Item>
          ))
          : null
      }
    </div>
  );
});

export default HeaderCheckbox;
