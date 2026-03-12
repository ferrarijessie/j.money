import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import moment from "moment";

const COLORS = ['#b787c5', '#ec8bbb', '#ff96a2', '#ffaf84', '#ffd26e', '#83d0c1ff'];
const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const SavingsLineChart = ({ savingsData }) => {
    const [selectedYear, setSelectedYear] = React.useState(moment().format('Y'));

    // Get all unique years from savings data
    const years = [...new Set(savingsData.map(saving => saving.year))].sort((a, b) => b - a);

    // Calculate cumulative total of all years before the selected year for each type
    const previousYearTotals = savingsData.reduce((acc, saving) => {
        if (Number(saving.year) >= Number(selectedYear)) {
            return acc;
        }

        const typeName = saving.typeName;
        if (!acc[typeName]) {
            acc[typeName] = 0;
        }
        acc[typeName] += saving.value;
        return acc;
    }, {});

    // Group savings by type and month for the selected year
    const groupedData = savingsData.reduce((acc, saving) => {
        if (saving.year+'' !== selectedYear) {
            return acc;
        }
        const monthIndex = saving.month - 1;
        const typeName = saving.typeName;
        
        if (!acc[typeName]) {
            // Initialize with previous year's total
            acc[typeName] = MONTHS.map(() => 0);
            if (previousYearTotals[typeName]) {
                acc[typeName][0] = previousYearTotals[typeName];
            }
        }
        
        acc[typeName][monthIndex] += saving.value;
        
        return acc;
    }, {});

    // Convert to format suitable for recharts with cumulative values
    const chartData = MONTHS.map((month, index) => {
        const data = { month };
        Object.entries(groupedData).forEach(([typeName, values]) => {
            // Calculate cumulative sum up to this month
            data[typeName] = values.slice(0, index + 1).reduce((acc, val) => acc + val, 0);
        });
        return data;
    });

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', marginRight: '1rem' }}>Monthly Savings</div>
                <select 
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ padding: '4px', fontSize: '14px' }}
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div style={{ height: '300px', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                            tickFormatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                            style={{ fontSize: '10px' }}
                        />
                        <Tooltip 
                            formatter={(value) => `R$ ${value.toFixed(2)}`}
                            contentStyle={{ backgroundColor: '#fff', color: '#000' }}
                        />
                        <Legend />
                        {Object.keys(groupedData).map((typeName, index) => (
                            <Line
                                key={typeName}
                                type="monotone"
                                dataKey={typeName}
                                name={typeName}
                                stroke={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

export default SavingsLineChart;
