import React, { Component } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Legend, Sector } from 'recharts';
// import Helper from '../../../../../helper/utility';

/*
  Reference:
  http://recharts.org/en-US/examples/CustomActiveShapePieChart
*/
const renderActiveShape = (props) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent,
  } = props;

  return (
    <g>
      <text x={cx} y={cy + 20} dy={13} textAnchor="middle" className="datavalue">{(percent * 100).toFixed(2)}%</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius - 1}
        outerRadius={outerRadius + 7}
        fill={fill}
      />
    </g>
  );
};

export default class ChartPie extends Component {
  state = {
    activeIndex: -1,
    title: '',
  }

  onPieLeave = () => this.setState({ activeIndex: -1, title: '' });

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
      title: data.name,
    });
  }

  renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="chartLegends">
        {
          payload.map(entry => (
            <li style={{ color: entry.color }} key={`item-${entry.value}`}><span>{entry.icon} {entry.value}</span></li>
          ))
        }
      </ul>
    );
  };

  render() {
    const { data, title, colors } = this.props;
    return (
      <ResponsiveContainer height={150}>
        <PieChart>
          <Legend layout="vertical" verticalAlign="middle" align="right" content={this.renderLegend} />
          <Pie
            dataKey="value"
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            innerRadius="85%"
            outerRadius="100%"
            startAngle={0}
            endAngle={360}
            type="circle"
            fill="#8884d8"
            paddingAngle={0}
            onMouseEnter={this.onPieEnter}
            onMouseLeave={this.onPieLeave}
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
