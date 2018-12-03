import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { LineChart, Line, XAxis, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: '0 MOS.', 'Your Payments': 5000, 'Your Revenue': 5000 },
  { name: '1 MOS.', 'Your Payments': 5000, 'Your Revenue': 3398 },
  { name: '2 MOS.', 'Your Payments': 5000, 'Your Revenue': 9800 },
  { name: '3 MOS.', 'Your Payments': 5000, 'Your Revenue': 5908 },
  { name: '4 MOS.', 'Your Payments': 5000, 'Your Revenue': 6800 },
  { name: '5 MOS.', 'Your Payments': 5000, 'Your Revenue': 5800 },
  { name: '6 MOS.', 'Your Payments': 5000, 'Your Revenue': 6300 },
  { name: '7 MOS.', 'Your Payments': 5000, 'Your Revenue': 5908 },
  { name: '8 MOS.', 'Your Payments': 5000, 'Your Revenue': 3000 },
  { name: '9 MOS.', 'Your Payments': 5000, 'Your Revenue': 4100 },
  { name: '10 MOS.', 'Your Payments': 5000, 'Your Revenue': 5300 },
  { name: '11 MOS.', 'Your Payments': 5000, 'Your Revenue': 4800 },
  { name: '12 MOS.', 'Your Payments': 5000, 'Your Revenue': 6300 },
];
@inject('campaignStore')
@observer
export default class RevenueChart extends Component {
  componentDidMount(prevProps, prevState) {
    console.log('nextProps==>', prevProps);
    console.log('nextState==>', prevState);
    this.props.campaignStore.setFieldValue('isRenderRechart', false);
  }
  render() {
    const style = {
      top: 0,
      right: 0,
    };
    if (!this.props.campaignStore.isRenderRechart) {
      return null;
    }
    return (
      <ResponsiveContainer height={220}>
        <LineChart margin={{ top: 50, left: 20 }} height={100} data={data}>
          <Legend layout="vertical" verticalAlign="top" align="right" wrapperStyle={style} />
          <XAxis tickLine={false} axisLine={false} dataKey="name" interval={11} />
          <Line type="monotone" dataKey="Your Revenue" dot="" stroke="#20C86D" strokeWidth={3} />
          <Line type="monotone" dataKey="Your Payments" stroke="#263E64" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
