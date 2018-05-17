import React from 'react';
import { Card } from 'semantic-ui-react';
import { FillTable } from '../../../../../theme/table/NSTable';

const result = {
  columns: [
    {
      title: 'Statement Date', field: 'date',
    },
    {
      title: 'Description', field: 'description',
    },
    {
      title: 'Download as', field: 'actions', textAlign: 'right',
    },
  ],
  rows: Array(5).fill({
    date: '3/24/18', description: 'Monthly Statements', actions: ['download'],
  }),
};

const MonthlyStatements = () => (
  <Card fluid>
    <FillTable result={result} />
  </Card>
);

export default MonthlyStatements;
