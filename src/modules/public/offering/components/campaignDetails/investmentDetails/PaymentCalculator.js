/* eslint-disable react/no-multi-comp */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React, { Component } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import Helper from '../../../../../../helper/utility';

export default class PaymentCalculator extends Component {
  state = {
    activeIndex: 0,
  }
  handleHover = (data1, index) => {
    this.setState({
      activeIndex: index,
    });
  }
  handleHover = (data1, index) => {
    this.setState({
      activeIndex: index,
    });
  }

  formatY = item => Helper.CurrencyFormat(item);
  render() {
    return (
      <ResponsiveContainer height={320}>
        <BarChart
          width={600}
          height={300}
          data={this.props.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <XAxis dataKey="month" />
          <YAxis tickLine={false} tickFormatter={this.formatY} axisLine={false} orientation="left" />
          <Tooltip
            formatter={(value, name, props) => this.formatY(props.payload[name])}
          />
          <Legend />
          <Bar dataKey="Projected total payment" barSize={7} onMouseOver={this.handleHover}>
            {
              this.props.data.map((entry, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Cell cursor="pointer" fill={index === this.state.activeIndex ? '#263E64' : '#1781FB'} key={`cell-${index}`} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
