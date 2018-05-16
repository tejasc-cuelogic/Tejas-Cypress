import React from 'react';
import { Card } from 'semantic-ui-react';
import { FillTable } from '../../../../theme/table/NSTable';

const result = {
  columns: [
    {
      title: 'Statement Date', field: 'date',
    },
    {
      title: 'Form Type', field: 'formType',
    },
    {
      title: 'Download as', field: 'actions', textAlign: 'right',
    },
  ],
  rows: Array(8).fill({
    date: '3/24/18', formType: '1099-B and 1099-DIV', actions: ['download'],
  }),
};

const TaxForms = () => (
  <Card fluid>
    <FillTable result={result} />
  </Card>
);

export default TaxForms;
