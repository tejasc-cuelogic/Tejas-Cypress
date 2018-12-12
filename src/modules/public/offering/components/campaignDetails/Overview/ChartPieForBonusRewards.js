import React, { Component } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Sector } from 'recharts';

/*
  Reference:
  http://recharts.org/en-US/examples/CustomActiveShapePieChart
*/
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload,
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={13} textAnchor="middle" className="datavalue" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default class ChartPieForBonusRewards extends Component {
  state = {
    activeIndex: -1,
    title: '',
  }

  render() {
    const { data, title, colors } = this.props;
    return (
      <ResponsiveContainer height={220}>
        <PieChart>
          <Pie
            dataKey="value"
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            innerRadius={60}
            outerRadius={100}
            startAngle={0}
            endAngle={360}
            type="circle"
            fill="#20C86D"
            paddingAngle={0}
            icon={this.props.icon}
          >
            {
              data.map((entry, index) => (
                <Cell key={colors[index % colors.length]} fill={colors[index % colors.length]} />
              ))
            }
            <Label value={this.state.title || title} offset={0} position="center" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
