import React, { useState } from 'react';
import { Card, StyledBody } from 'baseui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Checkbox } from 'baseui/checkbox';
import { STYLE_TYPE } from 'baseui/checkbox';
import moment from 'moment';

import { useIncomes } from '../../hooks/incomes/useIncomes';
import { useExpenses } from '../../hooks/expenses/useExpenses';
import { useSavings } from '../../hooks/savings/useSavings';

const FinancialGraphs = () => {
    const [view, setView] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
    
    const { data: incomesData = [], isIncomesLoading } = useIncomes();
    const { data: expensesData = [], isExpensesLoading } = useExpenses();
    const { data: savingsData = [], isSavingsLoading } = useSavings();

    const calculateMonthlyTotal = (items, valueKey, year) => {
        const monthlyTotals = Array(12).fill(0);
        items.forEach(item => {
            const month = parseInt(item.month) - 1;
            if (!isNaN(month) && month >= 0 && month < 12 && item.year+'' === year) {
                monthlyTotals[month] += parseFloat(item[valueKey] || 0);
            }
        });
        return monthlyTotals;
    };

    const calculateYearlyTotal = (items, valueKey) => {
        const yearlyTotals = {};
        items.forEach(item => {
            const year = item.year || moment().format('YYYY');
            if (!yearlyTotals[year]) {
                yearlyTotals[year] = 0;
            }
            yearlyTotals[year] += parseFloat(item[valueKey] || 0);
        });
        return yearlyTotals;
    };

    const monthlyIncomeTotals = calculateMonthlyTotal(incomesData || [], 'value', selectedYear);
    const monthlyExpensesTotals = calculateMonthlyTotal(expensesData, 'value', selectedYear);
    const monthlySavingsTotals = calculateMonthlyTotal(savingsData, 'value', selectedYear);

    const yearlyIncomeTotals = calculateYearlyTotal(incomesData || [], 'value');
    const yearlyExpensesTotals = calculateYearlyTotal(expensesData, 'value');
    const yearlySavingsTotals = calculateYearlyTotal(savingsData, 'value');

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthName = moment().month(i).format('MMM');
        return {
            name: monthName,
            income: monthlyIncomeTotals[i] || 0,
            expenses: monthlyExpensesTotals[i] || 0,
            savings: monthlySavingsTotals[i] || 0,
        };
    });

    const yearlyData = [];
    
    const years = new Set([
        ...incomesData.map(item => item.year),
        ...expensesData.map(item => item.year),
        ...savingsData.map(item => item.year)
    ].filter(year => year));

    const allYearsSorted = Array.from(years).sort((a, b) => Number(a) - Number(b));

    allYearsSorted.forEach(year => {
        yearlyData.push({
            name: year,
            income: yearlyIncomeTotals[year] || 0,
            expenses: yearlyExpensesTotals[year] || 0,
            savings: yearlySavingsTotals[year] || 0
        });
    });

    const title = view === 'monthly' ? 'Showing Monthly Data' : 'Showing Yearly Data';
    const data = view === 'monthly' ? monthlyData : yearlyData;

    const hasData = 
        incomesData.length > 0 || 
        expensesData.length > 0 || 
        savingsData.length > 0;

    if (isIncomesLoading || isExpensesLoading || isSavingsLoading) {
        return (
            <Card
                title={title}
                overrides={{
                    Root: { style: { width: '100%', marginBottom: '20px' } }
                }}
            >
                <StyledBody>
                    Loading...
                </StyledBody>
            </Card>
        );
    }

    if (!hasData) {
        return (
            <Card
                title={title}
                overrides={{
                    Root: { style: { width: '100%', marginBottom: '20px' } }
                }}
            >
                <StyledBody>
                    <div style={{ textAlign: 'center', color: '#666' }}>
                        No data found to display
                    </div>
                </StyledBody>
            </Card>
        );
    }

    return (
        <Card
            title="Financial Overview"
            overrides={{
                Root: { style: { width: '100%', marginBottom: '20px' } }
            }}
        >
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1 1 auto' }}>
                    {title}
                </div>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    disabled={view !== 'monthly'}
                    style={{ padding: '4px', fontSize: '14px' }}
                >
                    {allYearsSorted.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <Checkbox
                    checked={view === 'monthly'}
                    onChange={(e) => {
                        const nextView = e.currentTarget.checked ? 'monthly' : 'yearly';
                        setView(nextView);
                    }}
                    checkmarkType={STYLE_TYPE.toggle_round}
                >
                    {view === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
                </Checkbox>
            </div>
            <StyledBody>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                            tickFormatter={(value) => `R$ ${Number(value).toFixed(2)}`}
                            style={{ fontSize: '8px' }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#2ecc71" name="Income" />
                        <Line type="monotone" dataKey="expenses" stroke="#e74c3c" name="Expenses" />
                        <Line type="monotone" dataKey="savings" stroke="#3498db" name="Savings" />
                    </LineChart>
                </ResponsiveContainer>
            </StyledBody>
        </Card>
    );
};

export default FinancialGraphs;
