/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Helper from '../../../../../../helper/utility';

class CustomTooltip extends Component {
  render() {
    const { data } = this.props;
    if (data && data.payload) {
      return (
        <div className="custom-tooltip">
          <p><b>{`${data.payload.month} Month`}</b></p>
          <p className="label" style={{ fontWeight: 'normal' }}>Projected total payment</p>
          <p className="highlight-text">{Helper.CurrencyFormat(data.payload['Projected total payment'])}</p>
        </div>
      );
    }
    return null;
  }
}
export default class PaymentCalculator extends Component {
  // state = {
  //   activeIndex: 0,
  // }
  // handleHover = (data1, index) => {
  //   this.setState({
  //     activeIndex: index,
  //   });
  // }

  formatY = item => Helper.CurrencyFormat(item);
  render() {
    return (
      <ResponsiveContainer height={320}>
        <LineChart
          width={600}
          height={300}
          data={this.props.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <XAxis interval={6} dataKey="month" />
          <YAxis tickLine={false} tickFormatter={this.formatY} axisLine={false} orientation="left" />
          <Tooltip
            cursor={{ fill: 'none', fillOpacity: 0.00 }}
            content={({ payload }) => (<CustomTooltip data={payload[0]} />)}
          />
          <Legend />
          <Line dataKey="Projected total payment" onMouseOver={this.handleHover} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
