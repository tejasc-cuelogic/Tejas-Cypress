/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import { includes } from 'lodash';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ResponsiveContainer, Bar, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Helper from '../../../../../../helper/utility';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('portfolioStore')
@withRouter
@observer
export default class PayOffChart extends Component {
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.portfolioStore.getPayOffData(accountType);
  }
  formatY = item => Helper.CurrencyFormat(item);
  render() {
    const data = this.props.portfolioStore.getChartData();
    if (data.length === 0) {
      return <InlineLoader text="No Data to Display!" />;
    }
    return (
      <ResponsiveContainer height={320}>
        <ComposedChart
          width={600}
          height={200}
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis axisLine={false} dataKey="name" interval={4} />
          <YAxis tickFormatter={this.formatY} axisLine={false} orientation="right" />
          <Tooltip
            formatter={(value, name, props) => [this.formatY(props.payload[name]), name]}
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
