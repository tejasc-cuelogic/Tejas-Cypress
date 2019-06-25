import React, { Component } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Legend } from 'recharts';

export default class ChartPie extends Component {
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
      <ResponsiveContainer height={180}>
        <PieChart style={{ zIndex: 100 }}>
          <Legend layout="vertical" verticalAlign="middle" align="right" content={this.renderLegend} />
          <Pie
            dataKey="value"
            data={data}
            innerRadius="90%"
            outerRadius="135%"
            startAngle={-270}
            endAngle={90}
            type="circle"
            fill="#8884d8"
            paddingAngle={0}
            icon={this.props.icon}
          >
            {
              data.map((entry, index) => (
                <Cell key={colors[index % colors.length]} fill={colors[index % colors.length]} />
              ))
            }
            <Label value={title} offset={0} position="center" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
