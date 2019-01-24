import React, { Component } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Helper from '../../../../../../helper/utility';

const data = [
  { month: '1', 'Projected total payment': 4000 },
  { month: '2', 'Projected total payment': 3000 },
  { month: '3', 'Projected total payment': 2000 },
  { month: '4', 'Projected total payment': 2780 },
  { month: '5', 'Projected total payment': 1890 },
  { month: '6', 'Projected total payment': 2390 },
  { month: '7', 'Projected total payment': 3490 },
  { month: '8', 'Projected total payment': 2000 },
  { month: '9', 'Projected total payment': 2780 },
  { month: '10', 'Projected total payment': 1890 },
  { month: '11', 'Projected total payment': 2390 },
  { month: '12', 'Projected total payment': 3490 },
  { month: '13', 'Projected total payment': 2000 },
  { month: '14', 'Projected total payment': 2780 },
  { month: '15', 'Projected total payment': 1890 },
  { month: '16', 'Projected total payment': 2390 },
  { month: '17', 'Projected total payment': 3490 },
  { month: '18', 'Projected total payment': 2000 },
  { month: '19', 'Projected total payment': 2780 },
  { month: '20', 'Projected total payment': 2000 },
];

export default class PaymentCalculator extends Component {
  componentWillMount() {
    console.log('here');
  }

  formatY = item => Helper.CurrencyFormat(item);
  render() {
    return (
      <ResponsiveContainer height={320}>
        <BarChart
          width={600}
          height={300}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <XAxis dataKey="month" />
          <YAxis tickFormatter={this.formatY} axisLine={false} orientation="right" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Projected total payment" barSize={7} fill="#1781FB" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
