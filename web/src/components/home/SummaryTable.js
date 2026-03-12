import React from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "baseui/button";
import { TableBuilder, TableBuilderColumn, SIZE } from "baseui/table-semantic";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';


export const actionItemOverrides = {
    overrides: {
        Block: {
            style: {
                gap: '5px',
                display: 'flex',
                justifyContent: 'flex-end'
            }
        }
    }
};

export const summaryTableOverrides = {
    TableBodyRow: {
      style: ({ $row }) => ({
        backgroundColor:
          $row.model === 'expense'
            ? "#fff2f2"
            : $row.model === 'income' ? "#f7ffef"
            : "#f0faff",
        ":hover": {
          backgroundColor: 
            $row.model === 'expense'
                ? "#e2b4b4"
                : $row.model === 'income' ? "#c4dcae"
                : "#aecfde",
        },
      }),
    },
    Root: {
        style: {
            marginTop: '20px',
            maxHeight: '600px',
            border: '#e9e9e9 1px solid'
        }
    },
    TableHeadCell: {
        style: {
            backgroundColor: "#e9e9e9",
        }
    },
    TableHeadCellSortable: {
        style: {
            backgroundColor: "#e9e9e9",
        }
    },
};

const buttonOverrides = {
    BaseButton: {
      style: ({ $theme }) => ({
        backgroundColor: "#ffffff00",
        color: "#24025f",
        height: '5px',
        padding: '0px',
      })
    }
};


const SummaryTable = ({
    data,
    onClickEdit,
    onClickDelete,
    onClickStatus
}) => {

    let navigate = useNavigate(); 

    const [sortColumn, setSortColumn] = React.useState("expenseTypeId");
    const [sortAsc, setSortAsc] = React.useState(true);

    const sortedData = React.useMemo(() => {
        return data.slice().sort((a, b) => {
          const left = sortAsc ? a : b;
          const right = sortAsc ? b : a;
          const leftValue = String(left[sortColumn]);
          const rightValue = String(right[sortColumn]);
    
          return leftValue.localeCompare(rightValue, "en", {
            numeric: true,
            sensitivity: "base",
          });
        });
    }, [sortColumn, sortAsc, data]);

    function handleSort(id) {
        if (id === sortColumn) {
          setSortAsc((asc) => !asc);
        } else {
          setSortColumn(id);
          setSortAsc(true);
        }
    };

    const getStatus = (item) => {
        if (item["model"] === "saving") {
            return item["status"] === true ? "USED" : "ADDED"
        }
        else {
            return item["status"] === true ? "OK" : " - "
        }
    };

    const onOptionSelect = (selectedOption, item, close) => {
        if (selectedOption['item']['id'] === 'status') {
            onClickStatus(item);
        }
        if (selectedOption['item']['id'] === 'value') {
            onClickEdit(item);
        }
        if (selectedOption['item']['id'] === 'delete') {
            onClickDelete(item);
        }
        close();
    };

    const expenseTypeActions = (item) => {
        let statusText = "Status"

        if (item["model"] === "saving") {
            statusText = item["status"] === true ? "Mark as Added" : "Mark as Used";
        }

        else {
            if (item["model"] === "expense") {
                statusText = item["status"] === true ? "Mark as Unpaid" : "Mark as Paid";
            }
            else {
                statusText = item["status"] === true ? "Mark as Not Received" : "Mark as Received";
            }
        }

        return (
            <StatefulPopover
                placement={PLACEMENT.bottomLeft}
                content={({ close }) => (
                    <StatefulMenu
                    items={[
                        {
                            label: statusText,
                            id: 'status'
                        },
                        {
                            label: "Edit",
                            id: 'value'
                        },
                        {
                            label: 'Delete',
                            id: 'delete'
                        }
                    ]}
                    onItemSelect={(option) => onOptionSelect(option, item, close)}
                    overrides={{
                        List: { style: { height: "110px", width: "138px" } },
                    }}
                    />
                )}
                >
                <Button overrides={buttonOverrides}>
                    <FontAwesomeIcon icon={faBars} />
                </Button>
            </StatefulPopover>
        )
    };
    
    return (
        <TableBuilder
            data={sortedData}
            sortColumn={sortColumn}
            sortOrder={sortAsc ? "ASC" : "DESC"}
            onSort={handleSort}
            overrides={summaryTableOverrides}
            size={SIZE.compact}
        >
            <TableBuilderColumn id="typeName" header="Type" sortable>
                {(row) => row["typeName"]}
            </TableBuilderColumn>
            <TableBuilderColumn id="categoryName" header="Category" sortable>
                {(row) => row["categoryName"].toUpperCase()}
            </TableBuilderColumn>
            <TableBuilderColumn id="status" header="Status" sortable>
                {(row) => getStatus(row)}
            </TableBuilderColumn>
            <TableBuilderColumn id="value" header="Value" numeric sortable>
                {(row) => `R$ ${row["value"].toFixed(2)}`}
            </TableBuilderColumn>
            <TableBuilderColumn id="actions" numeric>
                {(row) => expenseTypeActions(row)}
            </TableBuilderColumn>
        </TableBuilder>
    );
};

export default SummaryTable;