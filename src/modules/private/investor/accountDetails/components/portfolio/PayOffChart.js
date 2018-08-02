import React, { Component } from 'react';
import { ResponsiveContainer, Bar, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const data = [
  { name: 'May 2017', Payment: 250, 'Paid to date': 250 },
  { name: 'June 2017', Payment: 250, 'Paid to date': 500 },
  { name: 'July 2017', Payment: 250, 'Paid to date': 750 },
  { name: 'Aug 2017', Payment: 250, 'Paid to date': 1000 },
  { name: 'Sept 2017', Payment: 250, 'Paid to date': 1250 },
  { name: 'Oct 2017', Payment: 250, 'Paid to date': 1500 },
  { name: 'Nov 2017', Payment: 250, 'Paid to date': 1750 },
  { name: 'Dec 2017', Payment: 250, 'Paid to date': 2000 },
  { name: 'Jan 2018', Payment: 250, 'Paid to date': 2250 },
  { name: 'Feb 2018', Payment: 250, 'Paid to date': 2500 },
  { name: 'Mar 2018' },
  { name: 'April 2018' },
  { name: 'May 2018' },
  { name: 'June 2018' },
  { name: 'July 2018' },
  { name: 'Aug 2018' },
  { name: 'Sept 2018' },
];

export default class PayOffChart extends Component {
  render() {
    return (
      <ResponsiveContainer height={220}>
        <ComposedChart
          width={600}
          height={200}
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis axisLine={false} dataKey="name" />
          <YAxis axisLine={false} orientation="right" />
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
          <Bar dataKey="Payment" barSize={10} fill="#1781FB" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
