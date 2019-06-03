/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { ResponsiveContainer, Bar, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Helper from '../../../../../../helper/utility';
import { InlineLoader } from '../../../../../../theme/shared';
@withRouter
export default class PayOffChart extends Component {
  formatY = item => Helper.CurrencyFormat(item);
  render() {
    const data = this.props.chartData;
    if (data.length === 0) {
      return <InlineLoader text="No Data to Display!" />;
    }
    return (
      <ResponsiveContainer height={320}>
        <ComposedChart
          width={600}
          height={200}
          barGap={25}
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis axisLine={false} dataKey="name" interval={4} />
          <YAxis tickLine={false} tickFormatter={this.formatY} axisLine={false} orientation="right" />
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
          <Bar dataKey="Payment" barSize={7} fill="#1781FB" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
