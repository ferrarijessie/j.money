import React from "react";
import moment from "moment";

import { useNavigate } from "react-router-dom";

import { Tile, StyledParagraph } from "baseui/tile";
import { Skeleton } from "baseui/skeleton";
import { ListHeading } from "baseui/list";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyBills, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { 
    EXPENSES_MANAGER_PATH, 
    EXPENSE_TYPES_MANAGER_PATH, 
    EXPENSE_VALUES_MANAGER_PATH,
} from "../../../AppPaths";

import RecurrentMetrics from "../../../components/common/metrics/RecurrentMetrics";
import CategoryMetrics from "../../../components/common/metrics/CategoryMetrics";

import { useExpenseTypes } from "../../../hooks/expenseTypes/useExpenseTypes";
import { useExpenses } from "../../../hooks/expenses/useExpenses";
import { useExpensesList } from "../../../hooks/expenses/useExpensesList";

import { TagsContainerUI } from "../common/styled";
import { 
    managerSummaryGridOverrides,
    listHeadingOverrides, 
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { styled } from 'baseui';

const VerticalDivider = styled('div', {
    width: '1px',
    backgroundColor: '#ccc',
    height: '100%',
});


const ExpenseManager = () => {

    const navigate = useNavigate();

    const {
        isLoading: isTypesLoading, 
        error: typesError, 
        data: typesData = [],
        refetch: reloadTypes
    } = useExpenseTypes();

    const {
        isLoading: isExpensesLoading, 
        error: expensesError, 
        data: expensesData = [],
        refetch: reloadExpenses
    } = useExpenses();

    const {
        isLoading: isExpensesListLoading, 
        error: expensesListError, 
        data: expensesListData = [],
        refetch: reloadExpensesList
    } = useExpensesList(
        'all',
        moment().format('Y'),
        moment().format('M')
    );

    // Create a map of type IDs to their recurrence status
    const typeRecurrenceMap = new Map(
        typesData.map(type => [type.id, type.recurrent])
    );

    // Calculate metrics using the type recurrence map
    const metricsData = [
        {
            name: 'Recurrent',
            value: expensesListData
                .filter(expense => 
                    expense.year+'' === moment().format('Y') && expense.month+'' === moment().format('M')
                )
                .reduce((acc, expense) => {
                const isRecurrent = typeRecurrenceMap.get(expense.typeId);
                return isRecurrent ? acc + (typeof expense.value === 'number' ? expense.value : 0) : acc;
            }, 0)
        },
        {
            name: 'Non-Recurrent',
            value: expensesListData
                .filter(expense => 
                    expense.year+'' === moment().format('Y') && expense.month+'' === moment().format('M')
                )
                .reduce((acc, expense) => {
                const isRecurrent = typeRecurrenceMap.get(expense.typeId);
                return !isRecurrent ? acc + (typeof expense.value === 'number' ? expense.value : 0) : acc;
            }, 0)
        }
    ];

    // Calculate totals per category using category string
    const categoryTotals = expensesListData
        .filter(expense => 
            expense.year+'' === moment().format('Y') && expense.month+'' === moment().format('M')
        )
        .reduce((acc, expense) => {
        const categoryName = expense.category;
        const value = typeof expense.value === 'number' ? expense.value : 0;
        acc[categoryName] = (acc[categoryName] || 0) + value;
        return acc;
    }, {});

    return (
        <ManagerSubPage 
            activeItem={EXPENSES_MANAGER_PATH}
            itemTitle={"Expenses"}
        >  
            <TagsContainerUI>
                {isExpensesLoading && isTypesLoading ?
                    <>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="200px"
                            animation
                        />
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="200px"
                            animation
                        />
                    </>
                :
                    <>
                        <Tile
                            label="Expense Types"
                            leadingContent={() => <FontAwesomeIcon icon={faReceipt} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(EXPENSE_TYPES_MANAGER_PATH)}
                        >
                            <StyledParagraph>{typesData.length}</StyledParagraph>
                        </Tile>
                        <Tile
                            label="Expense Values"
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(EXPENSE_VALUES_MANAGER_PATH)}
                            >
                            <StyledParagraph>{expensesData.length}</StyledParagraph>
                        </Tile>
                    </>
                }
            </TagsContainerUI>

            <FlexGrid flexGridColumnCount={1} {...managerSummaryGridOverrides}>
                <FlexGridItem>
                    <FlexGrid flexGridColumnCount={2} gap="scale800" style={{ marginTop: '20px' }}>
                        <FlexGridItem>
                            <RecurrentMetrics 
                                recurrentTotal={metricsData.find(m => m.name === 'Recurrent').value}
                                nonRecurrentTotal={metricsData.find(m => m.name === 'Non-Recurrent').value}
                            />
                        </FlexGridItem>

                        <FlexGridItem style={{ borderLeft: '1px solid #ccc' }}>
                            <CategoryMetrics
                                totals={categoryTotals}
                            />
                        </FlexGridItem>
                    </FlexGrid>
                </FlexGridItem>
            </FlexGrid>
            
        </ManagerSubPage>
    );
};

export default ExpenseManager;