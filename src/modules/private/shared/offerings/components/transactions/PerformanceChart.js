import React, { Component } from 'react';
import { ResponsiveContainer, Bar, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Helper from '../../../../../../helper/utility';

const data = [
  { name: 'May 2017', 'Paid this month': 250, 'Paid to date': 250 },
  { name: 'June 2017', 'Paid this month': 150, 'Paid to date': 400 },
  { name: 'July 2017', 'Paid this month': 140, 'Paid to date': 540 },
  { name: 'Aug 2017', 'Paid this month': 260, 'Paid to date': 800 },
  { name: 'Sept 2017', 'Paid this month': 200, 'Paid to date': 1000 },
  { name: 'Oct 2017', 'Paid this month': 250, 'Paid to date': 1250 },
  { name: 'Nov 2017', 'Paid this month': 250, 'Paid to date': 1500 },
  { name: 'Dec 2017', 'Paid this month': 300, 'Paid to date': 1800 },
  { name: 'Jan 2018', 'Paid this month': 250, 'Paid to date': 2150 },
  { name: 'Feb 2018', 'Paid this month': 150, 'Paid to date': 2300 },
  { name: 'Mar 2018', 'Paid this month': 200, 'Paid to date': 2500 },
  { name: 'April 2018', 'Paid this month': 300, 'Paid to date': 2800 },
  { name: 'May 2018', 'Paid this month': 150, 'Paid to date': 2950 },
  { name: 'June 2018', 'Paid this month': 500, 'Paid to date': 3450 },
  { name: 'July 2018', 'Paid this month': 50, 'Paid to date': 3500 },
  { name: 'Aug 2018', 'Paid this month': 250, 'Paid to date': 3750 },
  { name: 'Sept 2018', 'Paid this month': 250, 'Paid to date': 4000 },
];

export default class PerformanceChart extends Component {
  formatY = item => Helper.CurrencyFormat(item);

  render() {
    return (
      <ResponsiveContainer height={320}>
        <ComposedChart
          width={600}
          height={200}
          data={data}
          margin={{
            top: 10, right: 30, left: 30, bottom: 0,
          }}
        >
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
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
          <Bar dataKey="Paid this month" barSize={7} fill="#1781FB" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
