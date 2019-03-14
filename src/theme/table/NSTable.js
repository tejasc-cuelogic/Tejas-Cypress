import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import Helper from '../../helper/utility';
import { DateTimeFormat } from '../shared';
// import { DataFormatter } from '../../helper';


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

const Actions = (props) => {
  let additionalFileIdRef = null;
  if (props.additionalActions && props.dataSet) {
    additionalFileIdRef = props.dataSet.instructions.find(i => i.key === `instruction${props.dataSet.mapKey}`).id;
  }
  return (
    <Aux>
      {props.additionalActions && additionalFileIdRef && (
        <Link to="/" style={{ textTransform: 'none' }} onClick={e => props.download(e, additionalFileIdRef)} className="action" >
          <Icon className="ns-file" /> Instructions&nbsp;&nbsp;&nbsp;
        </Link>
      )}
      <Link to="/" className="action" onClick={e => props.download(e, props.actions.fileId)} >
        <Icon className={`ns-file ${props[0]}`} /> {props.label || 'PDF'}
      </Link>
    </Aux>
  );
};

export const NoR = ({ cols, msg }) => (
  <Table.Row><Table.Cell textAlign="center" colSpan={cols}>{msg}</Table.Cell></Table.Row>
);

export const FillTable = ({
  result, loading, error, download, additionalActions, aRule, instructions,
}) => (
  <div className="table-wrapper">
    <Table unstackable singleLine className="investment-details">
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
                          {['amount'].includes(col.field) ? row.type === 'Withdrawal' ? `(${Helper.CurrencyFormat(row[col.field])})` : Helper.CurrencyFormat(row[col.field]) : (
                              ['createdAt', 'date'].includes(col.field) ?
                                <DateTimeFormat datetime={row[col.field]} /> : (
                                  (col.field === 'file') ? (
                                    <Actions
                                      download={download}
                                      actions={{ fileId: row.fileId }}
                                      additionalActions={aRule &&
                                        aRule.val.includes(parseFloat(row[aRule.key])) ?
                                        additionalActions : false
                                      }
                                      dataSet={{
                                        instructions,
                                        mapKey: aRule ? row[aRule.key] : null,
                                      }}
                                      label={col.label}
                                    />
                                  ) : (
                                    Array.isArray(row[col.field]) ? row[col.field].join(' and ') : row[col.field]
                                  )
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
