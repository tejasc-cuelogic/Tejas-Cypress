import React, { Component } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Label } from 'recharts';

const data = [
  { name: 'A2', value: 300 },
  { name: 'B1', value: 100 },
  { name: 'B2', value: 80 },
  { name: 'B3', value: 40 },
  { name: 'B4', value: 30 },
  { name: 'B5', value: 50 },
  { name: 'C1', value: 100 },
  { name: 'C2', value: 200 },
  { name: 'D1', value: 150 },
  { name: 'D2', value: 50 },
];

const COLORS = ['#C782FF', '#28DAC9', '#0681A1', '#86D200', '#D2FF85', '#474747'];

export default class BusinessType extends Component {
  render() {
    return (
      <ResponsiveContainer height={220}>
        <PieChart>
          <Pie data={data} cx={200} cy={200} innerRadius={70} outerRadius={100} fill="#82ca9d" label>
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
