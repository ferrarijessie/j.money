import React from "react";
import { useNavigate } from "react-router-dom";

import { Button, SIZE } from "baseui/button";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import { EXPENSE_TYPES_MANAGER_PATH } from "../../../../AppPaths";

import { 
    actionItemOverrides,
    typesTableOverrides
} from "../../common/overrides";

import moment from "moment";


const ExpenseTypesTable = ({
    data,
    onClickEdit,
    onClickDelete
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

    const routeChange = (item) =>{ 
        let path = `${EXPENSE_TYPES_MANAGER_PATH}/${item?.id}`; 
        navigate(path);
    }

    const expenseTypeActions = (item) => {
        return (
            <FlexGrid flexGridColumnCount={1}>
                <FlexGridItem {...actionItemOverrides}>
                    <Button 
                        size={SIZE.mini} onClick={() => onClickEdit(item)}
                        startEnhancer={<FontAwesomeIcon icon={faPen} />}
                    >
                        Edit
                    </Button>
                    <Button 
                        size={SIZE.mini} onClick={() => onClickDelete(item)}
                        startEnhancer={<FontAwesomeIcon icon={faTrash} />}
                    >
                        Delete
                    </Button>
                    <Button 
                        size={SIZE.mini} onClick={() => routeChange(item)}
                        startEnhancer={<FontAwesomeIcon icon={faEye} />}
                    >
                        View Details
                    </Button>
                </FlexGridItem>
            </FlexGrid>
        )
    };
    
    return (
        <TableBuilder
            data={sortedData}
            sortColumn={sortColumn}
            sortOrder={sortAsc ? "ASC" : "DESC"}
            onSort={handleSort}
            overrides={typesTableOverrides}
        >
            <TableBuilderColumn id="name" header="Name" sortable>
                {(row) => row["name"]}
            </TableBuilderColumn>
            <TableBuilderColumn id="category" header="Category" sortable>
                {(row) => row["category"].toUpperCase()}
            </TableBuilderColumn>
            <TableBuilderColumn id="recurrent" header="Recurrent" sortable>
                {(row) => row["recurrent"] === true ? "Yes" : "No"}
            </TableBuilderColumn>
            <TableBuilderColumn id="baseValue" header="Base Value" sortable>
                {(row) => row["baseValue"] ? `R$ ${row["baseValue"].toFixed(2)}` : "-"}
            </TableBuilderColumn>
            <TableBuilderColumn id="endDate" header="End Date" sortable>
                {(row) => row["endDate"] ? moment(row["endDate"]).format("DD/MM/YYYY") : "-"}
            </TableBuilderColumn>
            <TableBuilderColumn id="actions">
                {(row) => expenseTypeActions(row)}
            </TableBuilderColumn>
        </TableBuilder>
    );
};

export default ExpenseTypesTable;