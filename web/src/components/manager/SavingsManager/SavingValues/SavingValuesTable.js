import React from "react";
import { Check, DeleteAlt, Overflow } from "baseui/icon";
import {
    StatefulDataTable,
    CategoricalColumn,
    NumericalColumn,
  } from "baseui/data-table";

import moment from "moment";


const SavingValuesTable = ({
    savingsData = [],
    onClickEdit,
    onClickDelete,
    reload
}) => {
    const [rows, setRows] = React.useState([]);

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
        NumericalColumn({
            title: 'Value',
            precision: 2,
            mapDataToValue:  (data) => data.value,
        }), 
    ];

    React.useEffect(() => {
        if (savingsData.length > 0) {
            setRows(savingsData.map((saving) => ({id: saving.id, data: saving})))
        }
    }, [savingsData]);

    const rowActions = [
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

export default SavingValuesTable;