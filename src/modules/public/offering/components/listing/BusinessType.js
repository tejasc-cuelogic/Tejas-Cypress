import React, { Component } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Label } from 'recharts';

const data = [
  { name: 'Commercial Real Estate', value: 300 },
  { name: 'Restaurant & Bar', value: 100 },
  { name: 'Brewery & Pub', value: 80 },
  { name: 'Hospitality', value: 40 },
  { name: 'Health & Wellness', value: 30 },
  { name: 'Fitness', value: 50 },
  { name: 'Office', value: 100 },
  { name: 'Other', value: 200 },
];

const COLORS = ['#c1eada', '#addcd5', '#aed6dc', '#b0cfe3', '#afcadc', '#adbccc', '#adb6c4'];

export default class BusinessType extends Component {
  render() {
    return (
      <ResponsiveContainer height={220}>
        <PieChart>
          <Pie
            data={data}
            cx={200}
            cy={130}
            innerRadius={85}
            outerRadius={122}
            fill="#82ca9d"
            label={props => props.name}
          >
            {
              data.map((entry, index) => (
                <Cell key={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} />
              ))
            }
            <Label value="50 Campaigns" offset={0} position="center" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
