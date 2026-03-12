import React from "react";
import { Button } from 'baseui/button';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Card, StyledBody, StyledAction } from 'baseui/card';
import { Skeleton } from 'baseui/skeleton';

import moment from 'moment';

import FinancialGraphs from './FinancialGraphs';

import { useIncomesList } from '../../hooks/incomes/useIncomesList';
import { useExpensesList } from '../../hooks/expenses/useExpensesList';
import { useSavingsList } from '../../hooks/savings/useSavingsList';
import { useYearlySummary } from '../../hooks/summary/useYearSummary';

import ManagerSubPage from "./ManagerSubPage";


const Manager = () => {
    const {
        data: incomesData = [],
        isLoading: isIncomesLoading,
        error: incomesError
    } = useIncomesList(moment().format('Y'), moment().format('M'));

    const {
        data: expensesData = [],
        isLoading: isExpensesLoading,
        error: expensesError
    } = useExpensesList('all', moment().format('Y'), moment().format('M'));

    const {
        data: savingsData = [],
        isLoading: isSavingsLoading,
        error: savingsError
    } = useSavingsList(moment().format('Y'), moment().format('M'));

    const {
        data: yearlySummaryData = [],
        isLoading: isYearlySummaryLoading,
        error: yearlySummaryError
    } = useYearlySummary(moment().format('Y'));

    const calculateMonthlyTotal = (items, valueKey) => {
        return items.reduce((total, item) => {
            return total + parseFloat(item[valueKey] || 0);
        }, 0);
    };

    const monthlyIncome = calculateMonthlyTotal(incomesData, 'value');
    const monthlyExpenses = calculateMonthlyTotal(expensesData, 'value');
    const monthlySavings = calculateMonthlyTotal(savingsData, 'currentMonthValue');

    return (
        <ManagerSubPage itemTitle="Manage Financials">
            <FlexGrid flexGridColumnCount={3} flexGridColumnGap={'20px'}>
                <FlexGridItem>
                    <Card
                        title="Monthly Incomes"
                    >
                        <StyledBody>
                            {isIncomesLoading ?
                                <Skeleton
                                    rows={0}
                                    height="20px"
                                    animation
                                />
                            :
                                `R$ ${monthlyIncome.toFixed(2)}`
                            }
                        </StyledBody>
                        <StyledAction>
                            <Button
                                overrides={{ BaseButton: { style: { width: "100%" } } }}
                                kind="ghost"
                                onClick={() => window.location.href = '/manager/incomes'}
                            >
                                View Details
                            </Button>
                        </StyledAction>
                    </Card>
                </FlexGridItem>

                <FlexGridItem>
                    <Card
                        title="Monthly Expenses"
                    >
                        <StyledBody>
                            {isExpensesLoading ?
                                <Skeleton
                                    rows={0}
                                    height="20px"
                                    animation
                                />
                            :
                                `R$ ${monthlyExpenses.toFixed(2)}`
                            }
                        </StyledBody>
                        <StyledAction>
                            <Button
                                overrides={{ BaseButton: { style: { width: "100%" } } }}
                                kind="ghost"
                                onClick={() => window.location.href = '/manager/expenses'}
                            >
                                View Details
                            </Button>
                        </StyledAction>
                    </Card>
                </FlexGridItem>

                <FlexGridItem>
                    <Card
                        title="Monthly Savings"
                    >
                        <StyledBody>
                            {isSavingsLoading ?
                                <Skeleton
                                    rows={0}
                                    height="20px"
                                    animation
                                />
                            :
                                `R$ ${monthlySavings.toFixed(2)}`
                            }
                        </StyledBody>
                        <StyledAction>
                            <Button
                                overrides={{ BaseButton: { style: { width: "100%" } } }}
                                kind="ghost"
                                onClick={() => window.location.href = '/manager/savings'}
                            >
                                View Details
                            </Button>
                        </StyledAction>
                    </Card>
                </FlexGridItem>
            </FlexGrid>

            <FlexGrid flexGridColumnCount={1} flexGridColumnGap={'20px'} marginTop={'2rem'}>
                <FlexGridItem>
                    <FinancialGraphs
                        incomesData={incomesData}
                        expensesData={expensesData}
                        savingsData={savingsData}
                    />
                </FlexGridItem>
            </FlexGrid>
        </ManagerSubPage>
    );
};

export default Manager;