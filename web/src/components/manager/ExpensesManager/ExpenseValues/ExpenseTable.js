import React from "react";
import { Check, DeleteAlt, Overflow } from "baseui/icon";
import {
    StatefulDataTable,
    CategoricalColumn,
} from "baseui/data-table";

import { useExpensePut } from "../../../../hooks/expenses/useExpensePut";
import moment from "moment";


const ExpenseTable = ({
    expensesData = [],
    onClickEdit,
    onClickDelete,
    reload
}) => {
    const [rows, setRows] = React.useState([]);

    const { mutateAsync: editExpenseRequest } = useExpensePut();

    const onClickStatus = async (item) => {
        const expenseId = item.data.expenseId;

        await editExpenseRequest({
            id: expenseId, 
            payload: {
                'paid': item.data.paid ? false : true
            }
        });
        await reload();
    }

    const columns = [
        CategoricalColumn({
            title: 'Type',
            mapDataToValue: (data) => data.typeName,
        }),
        CategoricalColumn({
            title: 'Category',
            mapDataToValue:  (data) => data.category.toUpperCase(),
        }),
        CategoricalColumn({
            title: 'Month',
            mapDataToValue:  (data) => `${moment(`${data.month}/1/${data.year}`).format('MMM')}`,
        }),
        CategoricalColumn({
            title: 'Year',
            mapDataToValue:  (data) => `${data.year}`,
        }),
        CategoricalColumn({
            title: 'Paid',
            mapDataToValue:  (data) => data.paid ? 'OK' : '-',
        }),
        CategoricalColumn({
            title: 'Value',
            mapDataToValue:  (data) => `R$ ${data.value.toFixed(2)}`,
        }), 
    ];

    React.useEffect(() => {
        if (expensesData.length > 0) {
            setRows(expensesData.map((expense) => ({id: expense.expenseId, data: expense})))
        }
    }, [expensesData]);

    const rowActions = [
        {
          label: "Status",
          onClick: ({row }) => {
            onClickStatus(row);
          },
          renderIcon: Check,
        },
        {
            label: "Delete",
            onClick: ({row }) => {
              onClickDelete(row.data);
            },
            renderIcon: DeleteAlt,
        },
        {
            label: "Edit",
            onClick: ({row }) => {
              onClickEdit(row.data);
            },
            renderIcon: Overflow,
        },
    ]
    
    return (
        <>
            {rows.length > 0 &&
            <div style={{ height: "600px" }}>
                <StatefulDataTable 
                    columns={columns} 
                    rows={rows} 
                    rowActions={rowActions}
                    emptyMessage="No results so far"
                />
                </div>
            }
        </>
    );
};

export default ExpenseTable;