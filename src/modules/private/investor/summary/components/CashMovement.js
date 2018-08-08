import React, { Component } from 'react';
import { ResponsiveContainer, Bar, ComposedChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Helper from '../../../../../helper/utility';

const data = [
  { name: 'Jan 2018', Payment: 250, 'Paid to date': 350 },
  {
    name: 'Feb 2018', Invested: 2000, Payment: 150, 'Paid to date': 900,
  },
  {
    name: 'Mar 2018', Invested: 2000, Payment: 200, 'Paid to date': 1200,
  },
  {
    name: 'April 2018', Invested: 2000, Payment: 300, 'Paid to date': 1500,
  },
  {
    name: 'May 2018', Invested: 2000, Payment: 150, 'Paid to date': 2050,
  },
  {
    name: 'June 2018', Invested: 2000, Payment: 500, 'Paid to date': 2250,
  },
  { name: 'July 2018', Payment: 50, 'Paid to date': 2800 },
  { name: 'Aug 2018', Payment: 1150, 'Paid to date': 3550 },
  { name: 'Sept 2018', Payment: 750, 'Paid to date': 4000 },
  { name: 'Oct 2018', Payment: 950, 'Paid to date': 4500 },
  { name: 'Nov 2018', Payment: 1150, 'Paid to date': 6000 },
  { name: 'Dec 2018', Payment: 1050, 'Paid to date': 7000 },
];

export default class CashMovement extends Component {
  formatY = item => Helper.CurrencyFormat(item);
  render() {
    return (
      <ResponsiveContainer height={320}>
        <ComposedChart
          width={500}
          height={240}
          data={data}
          margin={{
            top: 30, right: 30, left: 30, bottom: 30,
          }}
        >
          <Legend />
          <XAxis axisLine={false} dataKey="name" interval={4} />
          <YAxis tickFormatter={this.formatY} axisLine={false} orientation="left" />
          <Tooltip />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#84BCFC" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#84BCFC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="Paid to date"
            stroke="#84BCFC"
            fillOpacity={1}
            fill="url(#gradient)"
          />
          <Bar dataKey="Payment" barSize={12} fill="#1781FB" />
          <Bar dataKey="Invested" barSize={12} fill="#20C86D" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
