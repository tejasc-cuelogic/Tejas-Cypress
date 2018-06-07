import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Icon } from 'semantic-ui-react';
import Aux from 'react-aux';
import Helper from '../../helper/utility';


export const THeader = ({ columns }) => (
  <Table.Header>
    <Table.Row>
      {
        columns.map(col => (
          <Table.HeaderCell key={col.field} textAlign={col.textAlign}>{col.title}</Table.HeaderCell>
        ))
      }
    </Table.Row>
  </Table.Header>
);

const Actions = props => (
  <Aux>
    <Link className="action" to="/app/account-details/individual/statements/monthly-statements"><Icon className={`ns-file ${props[0]}`} /> PDF</Link>
  </Aux>
);

export const FillTable = props => (
  <div className="table-wrapper">
    <Table unstackable singleLine className="investment-details">
      <THeader columns={props.result.columns} />
      <Table.Body>
        {
          props.result.rows.map(row => (
            <Table.Row key={Helper.guid()}>
              {
                props.result.columns.map(col => (
                  <Table.Cell key={col.field} textAlign={col.textAlign}>
                    {['amount'].includes(col.field) ? Helper.CurrencyFormat(row[col.field]) : (
                        (col.field === 'actions') ? <Actions actions={row[col.field]} /> : row[col.field]
                      )
                    }
                  </Table.Cell>
                ))
              }
            </Table.Row>
          ))
        }
      </Table.Body>
    </Table>
  </div>
);
