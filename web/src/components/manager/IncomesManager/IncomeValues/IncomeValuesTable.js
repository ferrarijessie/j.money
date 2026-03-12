import React from "react";
import { Check, DeleteAlt, Overflow } from "baseui/icon";
import {
    StatefulDataTable,
    CategoricalColumn,
    NumericalColumn,
  } from "baseui/data-table";

import { useIncomePut } from "../../../../hooks/incomes/useIncomePut";
import moment from "moment";


const IncomeValuesTable = ({
    incomesData = [],
    onClickEdit,
    onClickDelete,
    reload
}) => {
    const [rows, setRows] = React.useState([]);

    const { mutateAsync: editIncomeRequest } = useIncomePut();

    const onClickStatus = async (item) => {
        const incomeId = item.data.id;

        await editIncomeRequest({
            id: incomeId, 
            payload: {
                'received': item.data.received ? false : true
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
            title: 'Month',
            mapDataToValue:  (data) => `${moment(`${data.month}/1/${data.year}`).format('MMM')}`,
        }),
        CategoricalColumn({
            title: 'Year',
            mapDataToValue:  (data) => `${data.year}`,
        }),
        CategoricalColumn({
            title: 'Received',
            mapDataToValue:  (data) => data.received ? 'OK' : '-',
        }),
        NumericalColumn({
            title: 'Value',
            precision: 2,
            mapDataToValue:  (data) => data.value,
        }), 
    ];

    React.useEffect(() => {
        if (incomesData.length > 0) {
            setRows(incomesData.map((income) => ({id: income.incomeId, data: income})))
        }
    }, [incomesData]);

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

export default IncomeValuesTable;