import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Icon } from 'semantic-ui-react';
import Aux from 'react-aux';
import Helper from '../../helper/utility';
import DateTimeFormat from '../common/DateTimeFormat';

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
    <Link className={`action ${props.actions.fileName}`} to="/">
      <Icon className={`ns-file ${props[0]}`} /> PDF
    </Link>
  </Aux>
);

const NoR = ({ cols, msg }) => (
  <Table.Row><Table.Cell textAlign="center" colSpan={cols}>{msg}</Table.Cell></Table.Row>
);

export const FillTable = ({ result, loading, error }) => (
  <div className="table-wrapper">
    <Table singleLine className="investment-details">
      <THeader columns={result.columns} />
      <Table.Body>
        {
          error ? <NoR cols={result.columns.length} msg="Error while loading data" /> : (
            loading ? <NoR cols={result.columns.length} msg="Loading.." /> : (
              result.rows.length === 0 ? (
                <NoR cols={result.columns.length} msg="No record to display" />
              ) : (
                result.rows.map(row => (
                  <Table.Row key={Helper.guid()}>
                    {
                      result.columns.map(col => (
                        <Table.Cell key={col.field} textAlign={col.textAlign}>
                          {['amount'].includes(col.field) ? Helper.CurrencyFormat(row[col.field]) : (
                              ['taxFormDate', 'statementDate'].includes(col.field) ?
                                <DateTimeFormat datetime={row[col.field]} /> : (
                                  (col.field === 'file') ? <Actions actions={row[col.field]} /> :
                                  row[col.field]
                                )
                            )
                          }
                        </Table.Cell>
                      ))
                    }
                  </Table.Row>
                ))
              )
            )
          )
        }
      </Table.Body>
    </Table>
  </div>
);
