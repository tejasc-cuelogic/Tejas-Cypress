/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import { ResponsiveContainer, Bar, ComposedChart, Area, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { InlineLoader } from '../../../../../theme/shared';
import Helper from '../../../../../helper/utility';

export default class CashMovement extends Component {
  formatY = item => Helper.CurrencyFormat(item);
  render() {
    const { data } = this.props;
    if (!data || data.length === 0) {
      return <InlineLoader text="No data" />;
    }
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
          <YAxis tickLine={false} tickFormatter={this.formatY} axisLine={false} orientation="left" />
          <Tooltip
            formatter={(value, name, props) => this.formatY(props.payload[name])}
          />
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
