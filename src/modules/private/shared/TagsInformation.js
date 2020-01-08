import React from 'react';
import { map } from 'lodash';
import { Table, Header } from 'semantic-ui-react';

const TagsInformation = ({ tags }) => (
  <>
    <Header as="h6">Tags Information</Header>
    <div className="bg-offwhite">
      <div className="table-wrapper">
        <Table unstackable basic="very" fixed>
          <Table.Body>
            {tags
              ? map(tags, (t, key) => key !== '__typename' && (
              <Table.Row>
                <Table.Cell>{key}</Table.Cell>
                <Table.Cell>{t}</Table.Cell>
              </Table.Row>
              )) : null
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  </>
);

export default TagsInformation;
