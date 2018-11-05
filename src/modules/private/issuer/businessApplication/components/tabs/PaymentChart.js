import React from 'react';
import Aux from 'react-aux';
import { Header, Table } from 'semantic-ui-react';

const GeneralConditions = () => (
  <Aux>
    <Header as="h4">Amortization Schedule Example</Header>
    <Table unstackable singleLine className="investment-details" textAlign="right">
      <Table.Header>
        <Table.Row>
          {['No', 'Loan Amount', 'Payment', 'Interest', 'Principal', 'Balance', 'Interest', 'Principal'].map(item => (
            <Table.HeaderCell>{item}</Table.HeaderCell>
          ))
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
          <Table.Row>
            {[index, '$21,00', '$2,800', '$1,470,', '$1,330', '$19,670', '52.5%', '47.5%'].map((value, subIndex) => (
              <Table.Cell>
                {(subIndex === 1) || (subIndex === 6) || (subIndex === 7) ?
                  <b>{value}</b> : value
              }
              </Table.Cell>
            ))
            }
          </Table.Row>
        ))
        }
      </Table.Body>
    </Table>
  </Aux>
);

export default GeneralConditions;
