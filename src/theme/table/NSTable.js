import React from 'react';
import { Table } from 'semantic-ui-react';
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
                          {row[col.field]}
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
