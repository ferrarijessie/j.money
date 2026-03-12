import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#b787c5', '#ec8bbb', '#ff96a2', '#ffaf84', '#ffd26e', '#83d0c1ff'];

const CategoryMetrics = ({ totals, title = "Categories" }) => {
    // Convert totals object to array of {name, value} pairs
    const metricsData = Object.entries(totals).map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
    }));

    return (
        <>
            <div style={{ marginBottom: '0.5rem', fontWeight: 'bold', paddingLeft: '1rem' }}>{title}</div>
            <div style={{ height: '300px', marginTop: '1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        data={metricsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                    >
                        {metricsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Legend
                        layout="vertical"
                        align="right"
                        verticalAlign="middle"
                        formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                    />
                    <Tooltip 
                        formatter={(value) => `R$ ${value.toFixed(2)}`}
                        contentStyle={{ backgroundColor: '#fff', color: '#000' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
        </>
    );
};

export default CategoryMetrics;
