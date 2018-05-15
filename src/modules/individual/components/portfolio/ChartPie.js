import React, { Component } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip, Legend, Sector } from 'recharts';
import Helper from '../../../../helper/utility';

/*
  Reference:
  http://recharts.org/en-US/examples/CustomActiveShapePieChart
*/
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + ((outerRadius + 10) * cos);
  const sy = cy + ((outerRadius + 10) * sin);
  const mx = cx + ((outerRadius + 30) * cos);
  const my = cy + ((outerRadius + 30) * sin);
  const ex = mx + ((cos >= 0 ? 1 : -1) * 22);
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <defs>
        <filter x="-10%" y="-10%" width="120%" height="120%" id="solid">
          <feFlood floodColor="#fafafa" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
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
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + ((cos >= 0 ? 1 : -1) * 12)} y={ey} textAnchor={textAnchor} fill="#333" filter="url(#solid)">{payload.name}</text>
      <text x={ex + ((cos >= 0 ? 1 : -1) * 12)} y={ey} dy={18} textAnchor={textAnchor} fill="#999" filter="url(#solid)">
        {`${Helper.CurrencyFormat(value)} (${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default class ChartPie extends Component {
  state = {
    activeIndex: 0,
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
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
      <ResponsiveContainer height={220}>
        <PieChart>
          <Legend layout="vertical" verticalAlign="middle" align="right" content={this.renderLegend} />
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            // cx={200}
            // cy={110}
            innerRadius="85%"
            outerRadius="100%"
            startAngle={0}
            endAngle={360}
            type="circle"
            fill="#8884d8"
            paddingAngle={0}
            onMouseEnter={this.onPieEnter}
            icon={this.props.icon}
          >
            {
              data.map((entry, index) => <Cell fill={colors[index % colors.length]} />)
            }
            <Label value={title} offset={0} position="center" />
            <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#cd0000' }} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
