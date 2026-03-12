import React from "react";
import moment from "moment";

import { setItemActive } from "baseui/app-nav-bar";

import { Block } from "baseui/block";
import { styled } from "styletron-react";
import { Delete, Plus } from "baseui/icon";
import { Tile, TILE_KIND, ALIGNMENT, StyledParagraph } from "baseui/tile";
import { Button, SHAPE, KIND, SIZE } from "baseui/button";
import { ButtonGroup } from "baseui/button-group";
import { StatefulPopover, PLACEMENT } from "baseui/popover";
import { StatefulMenu } from "baseui/menu";
import { Select, SIZE as SelectSize } from "baseui/select";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBills, faWallet, faSackDollar, faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

import { useSummaryList } from "../../hooks/summary/useSummaryList";
import { useExpenseDelete } from "../../hooks/expenses/useExpenseDelete";
import { useExpensePut } from "../../hooks/expenses/useExpensePut";
import { useIncomeDelete } from "../../hooks/incomes/useIncomeDelete";
import { useIncomePut } from "../../hooks/incomes/useIncomePut";
import { useSavingDelete } from "../../hooks/savings/useSavingDelete";
import { useSavingPut } from "../../hooks/savings/useSavingPut";
import { useIncomeTypes } from "../../hooks/incomeTypes/useIncomeTypes";
import { useExpenseTypes } from "../../hooks/expenseTypes/useExpenseTypes";
import { useSavingTypes } from "../../hooks/savingTypes/useSavingTypes";

import AppNavigation from "../common/AppNavigation";
import ConfirmActionModal from "../common/ConfirmActionModal";
import ExpenseModal from "../common/ExpensesActions/ExpenseModal";
import IncomeModal from "../common/IncomeActions/IncomeModal";
import SavingValueModal from "../common/SavingActions/SavingValueModal";
import SummaryTable from "./SummaryTable";
import EmptySummary from "./EmptySummary";
import { ControlContainer } from "baseui/form-control/styled-components";
import { BaseButton } from "baseui/button/styled-components";


const ContainerUI = styled(Block, {
    padding: "30px 80px"
});

const TileParagraph = styled(StyledParagraph, {
    alignSelf: 'center',
});

const addButtonItemOverrides = {
    overrides: {
        Block: {
            style: {
                display: 'flex',
                justifyContent: 'flex-end'
            }
        }
    }
};

export const periodGridOverrides = {
    overrides: {
        Block: {
            style : {
                width: '100%',
                background: '#000000',
                // padding: '10px',
                justifyContent: 'center',
            }
        }
    }
}

export const yearSelectItemOverrides = {
    overrides: {
        Block: {
            style : {
                width: '85px',
                flexGrow: 0,
                padding: '0px 5px',
                borderRight: '1px solid #555555',
                borderLeft: '1px solid #555555',
            }
        }
    }
};

export const yearSelectInputOverrides = {
    overrides: {
        ControlContainer: {
            style: {
                    color: '#eeeeee',
                    fontWeight: 600,
                    borderLeftColor: '#000000',
                    borderRightColor: '#000000',
                    borderTopColor: '#000000',
                    borderBottomColor: '#000000',
                    backgroundColor: '#000000',
            }
        },
        SelectArrow: {
            props: {
                overrides: {
                    Svg: {
                        style: {
                            color: '#eeeeee',
                            cursor: 'pointer',
                        }
                    }
                }
            }
        }
    }
};

export const monthSelectItemOverrides = {
    overrides: {
        Block: {
            style : {
                flexGrow: 0,
            }
        }
    }
};

export const monthButtonGroupOverrides = {
    overrides: {
        Root: {
            style: {
                columnGap: '0px',
            }
        }
    }
};

export const monthButtonOverrides = {
    overrides: {
        BaseButton: {
            style: {
                width: '95px',
                backgroundColor: '#000000',
                color: '#eeeeee',
                borderRadius: '0px',
                borderRight: '1px solid #555555',
                fontWeight: 600,
            }
        }
    }
};

const expensesTileOverrides = {
    overrides: {
        Root: {
            style: ({ $selected }) => ({
                marginLeft: "30px",
                outline: '#e2b4b4 solid',
                backgroundColor: "#fff2f2",
                height: "110px",
                ":hover": {
                    backgroundColor: '#e2b4b4 !important',
                },
                boxShadow:
                    $selected
                        ? "inset 0px 0px 0px 3px #c30000"
                        : null
            })
        }
    }
};

const incomesTileOverrides = {
    overrides: {
        Root: {
            style: ({ $selected }) => ({
                outline: '#c4dcae solid',
                backgroundColor: "#f7ffef",
                height: "110px",
                ":hover": {
                    backgroundColor: '#c4dcae !important',
                },
                boxShadow:
                    $selected
                        ? "inset 0px 0px 0px 3px #4e7528"
                        : null
            })
        }
    }
};

const savingsTileOverrides = {
    overrides: {
        Root: {
            style: ({ $selected }) => ({
                marginLeft: "30px",
                marginRight: "30px",
                outline: '#aecfde solid',
                backgroundColor: "#f0faff",
                height: "110px",
                ":hover": {
                    backgroundColor: '#aecfde !important',
                },
                boxShadow:
                    $selected
                        ? "inset 0px 0px 0px 3px #345c6f"
                        : null
            })
        }
    }
};

const balanceTileOverrides = {
    overrides: {
        Root: {
            style: ({ $selected }) => ({
                marginRight: "30px",
                outline: '#b8aede solid',
                backgroundColor: "#f8f0ff",
                height: "110px",
                ":hover": {
                    backgroundColor: '#f8f0ff !important',
                },
            })
        }
    }
};

const Home = () => {
    const [selectedYear, setSelectedYear] = React.useState([{id: moment().format("YYYY"), label: moment().format("YYYY")}]);
    const [selectedMonth, setSelectedMonth] = React.useState(moment().format("M"));

    const [isExpensesSelected, setIsExpensesSelected] = React.useState(false);
    const [isIncomesSelected, setIsIncomesSelected] = React.useState(false);
    const [isSavingsSelected, setIsSavingsSelected] = React.useState(false);

    const [filters, setFilters] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);

    const [selectedItem, setSelectedItem] = React.useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false);
    const [isSavingModalOpen, setIsSavingModalOpen] = React.useState(false);

    const { mutateAsync: deleteExpenseRerquest } = useExpenseDelete();
    const { mutateAsync: deleteIncomeRerquest } = useIncomeDelete();
    const { mutateAsync: deleteSavingRerquest } = useSavingDelete();

    const { mutateAsync: updateExpenseRerquest } = useExpensePut();
    const { mutateAsync: updateIncomeRerquest } = useIncomePut();
    const { mutateAsync: updateSavingRerquest } = useSavingPut();

    const {
        data: data = [],
        isLoading: isLoading,
        refetch: reload
    } = useSummaryList(selectedYear[0].id, selectedMonth);

    const {
        data: expenseTypes = []
    } = useExpenseTypes();

    const {
        data: incomeTypes = []
    } = useIncomeTypes();

    const {
        data: savingTypes = []
    } = useSavingTypes();

    const selectItem = (item) => {
        setIsExpensesSelected(item === "expenses" ? !isExpensesSelected : isExpensesSelected);
        setIsIncomesSelected(item === "incomes" ? !isIncomesSelected : isIncomesSelected);
        setIsSavingsSelected(item === "savings" ? !isSavingsSelected : isSavingsSelected);
    };

    const onCloseModal = () => {
        setSelectedItem(null);
        setIsConfirmModalOpen(false);
        setIsExpenseModalOpen(false);
        setIsIncomeModalOpen(false);
        setIsSavingModalOpen(false);
    };

    const onClickDelete = (item) => {
        setSelectedItem(item);
        setIsConfirmModalOpen(true);
    };

    const onClickStatus = async (item) => {
        if (item["model"] === "expense") {
            await updateExpenseRerquest({
                id: item["id"], 
                payload: {
                    'paid': item["status"] ? false : true
                }
            });
        }
        if (item["model"] === "income") {
            await updateIncomeRerquest({
                id: item["id"], 
                payload: {
                    'received': item["status"] ? false : true
                }
            });
        }
        if (item["model"] === "saving") {
            await updateSavingRerquest({
                id: item["id"], 
                payload: {
                    'used': item["status"] ? false : true
                }
            });
        }
        await reload();
        onCloseModal();
    };

    const onClickEdit = (item) => {
        onCloseModal();
        setSelectedItem(item);

        if (item["model"] === "expense") {
            setIsExpenseModalOpen(true);
        }
        if (item["model"] === "income") {
            setIsIncomeModalOpen(true);
        }
        if (item["model"] === "saving") {
            setIsSavingModalOpen(true);
        }
    };

    const onConfirmDelete = async () => {
        if (selectedItem["model"] === "expense") {
            await deleteExpenseRerquest(selectedItem["id"]);
        }
        else if (selectedItem["model"] === "income") {
            await deleteIncomeRerquest(selectedItem["id"]);
        }
        else if (selectedItem["model"] === "saving") {
            await deleteSavingRerquest(selectedItem["id"]);
        }
        await reload();
        onCloseModal();
    };

    React.useEffect(() => {
        let filtersList = [];

        if (!!isExpensesSelected) {
            filtersList = [...filtersList, "expense"]
        }
        if (!!isIncomesSelected) {
            filtersList = [...filtersList, "income"]
        }
        if (!!isSavingsSelected) {
            filtersList = [...filtersList, "saving"]
        }

        setFilters(filtersList);
    }, [isExpensesSelected, isIncomesSelected, isSavingsSelected]);

    React.useEffect(() => {
        if (data.length > 0) {
            if (filters.length > 0) {
                setFilteredData(data.filter(item => filters.some(f => item.model === f)))
            } else {
                setFilteredData(data);
            }
        }
    }, [data, filters]);

    const ITEMS = [
        { label: "New Expense", id: "expense" },
        { label: "New Income", id: "income" },
        { label: "New Saving", id: "saving" },
    ];

    const openAddModal = (item, close) => {
        onCloseModal();

        if (item["item"]["id"] === "expense") {
            setIsExpenseModalOpen(true);
        }
        if (item["item"]["id"] === "income") {
            setIsIncomeModalOpen(true);
        }
        if (item["item"]["id"] === "saving") {
            setIsSavingModalOpen(true);
        }
        
        close();
    };

    const getBalance = () => {
        const totalSavings = data.reduce((acc, p) => p.model === 'saving' && p.status === false ? acc + p.value : acc, 0);
        const totalExpense = data.reduce((acc, p) => p.model === 'expense' ? acc + p.value : acc, 0);
        const totalIncome = data.reduce((acc, p) => p.model === 'income' ? acc + p.value : acc, 0);
        return (totalIncome - (totalSavings + totalExpense)).toFixed(2);
    };

    const yearItems = ['2024','2025','2026','2027','2028','2029', '2030'];

    const onYearSelect = (item) => {
        setSelectedYear(item);

        if (item === moment().format('YYYY')) {
            setSelectedMonth(moment().format('M'));
        } else {
            setSelectedMonth('1');
        }
    };


    return (
        <>
            <AppNavigation />

            <FlexGrid flexGridColumnCount={2} {...periodGridOverrides}>
                <FlexGridItem {...yearSelectItemOverrides}>
                    <Select
                        options={yearItems.map((y) => ({ label: y, id: y }))}
                        value={selectedYear}
                        labelKey="label"
                        valueKey="id"
                        placeholder={!selectedYear ? "Select year" : null}
                        clearable={false}
                        creatable={false}
                        onChange={(params) => onYearSelect(params.value)}
                        size={SelectSize.compact}
                        {...yearSelectInputOverrides}
                    />
                </FlexGridItem>
                
                <FlexGridItem {...monthSelectItemOverrides}>
                    <ButtonGroup size={SIZE.compact} kind={KIND.secondary}>
                        {moment.months().map((m, idx) => {
                        const monthValue = String(idx + 1);
                        const isActive = selectedMonth === monthValue;

                        return (
                            <Button
                            key={monthValue}
                            onClick={() => setSelectedMonth(monthValue)}
                            disabled={isActive}
                            {...monthButtonOverrides}
                            >
                                {m}
                            </Button>
                        );
                        })}
                    </ButtonGroup>
                </FlexGridItem>
            </FlexGrid>

            <ContainerUI>

                <FlexGrid flexGridColumnCount={2}>

                    <FlexGridItem>
                        <Tile
                            tileKind={TILE_KIND.selection}
                            leadingContent={() => <FontAwesomeIcon icon={faWallet} size="2xl" />}
                            label={`R$ ${data.reduce((acc, p) => p.model === 'income' ? acc + p.value : acc, 0).toFixed(2)}`}
                            children={<TileParagraph>Incomes</TileParagraph>}
                            headerAlignment={ALIGNMENT.center}
                            bodyAlignment={ALIGNMENT.center}
                            onClick={() => selectItem("incomes")}
                            selected={isIncomesSelected}
                            {...incomesTileOverrides}
                        />

                        <Tile
                            tileKind={TILE_KIND.selection}
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            label={`R$ ${data.reduce((acc, p) => p.model === 'expense' ? acc + p.value : acc, 0).toFixed(2)}`}
                            children={<TileParagraph>Expenses</TileParagraph>}
                            headerAlignment={ALIGNMENT.center}
                            bodyAlignment={ALIGNMENT.center}
                            onClick={() => selectItem("expenses")}
                            selected={isExpensesSelected}
                            {...expensesTileOverrides}
                        />

                        <Tile
                            tileKind={TILE_KIND.selection}
                            leadingContent={() => <FontAwesomeIcon icon={faSackDollar} size="2xl" />}
                            label={`R$ ${data.reduce((acc, p) => p.model === 'saving' ? acc + p.value : acc, 0).toFixed(2)}`}
                            children={<TileParagraph>Savings</TileParagraph>}
                            headerAlignment={ALIGNMENT.center}
                            bodyAlignment={ALIGNMENT.center}
                            onClick={() => selectItem("savings")}
                            selected={isSavingsSelected}
                            {...savingsTileOverrides}
                        />

                        <StatefulPopover
                            focusLock
                            placement={PLACEMENT.bottom}
                            content={({close}) => (
                                <StatefulMenu 
                                    items={ITEMS}
                                    onItemSelect={(option) => openAddModal(option, close)}
                                />
                            )}
                        >
                            <Button shape={SHAPE.circle}>
                                <Plus />
                            </Button>
                        </StatefulPopover>
                    </FlexGridItem>

                    {filteredData.length > 0 && 
                        <FlexGridItem {...addButtonItemOverrides}>
                            <Tile
                                leadingContent={() => <FontAwesomeIcon icon={faScaleBalanced} size="2xl" />}
                                label={`R$ ${getBalance()}`}
                                children={<TileParagraph>Balance</TileParagraph>}
                                headerAlignment={ALIGNMENT.center}
                                bodyAlignment={ALIGNMENT.center}
                                {...balanceTileOverrides}
                            />
                        </FlexGridItem>
                    }

                </FlexGrid>

                {filteredData.length > 0 ? 
                    <SummaryTable 
                        data={filteredData}
                        onClickDelete={onClickDelete}
                        onClickEdit={onClickEdit}
                        onClickStatus={onClickStatus}
                    />
                :
                    <EmptySummary />
                }
                
            </ContainerUI>

            {selectedItem && 
                <ConfirmActionModal 
                    isOpen={isConfirmModalOpen}
                    onClose={onCloseModal}
                    onConfirmClick={onConfirmDelete}
                    title={`Delete ${selectedItem["model"]}?`}
                    content={`Are you sure you want to delete ${selectedItem["model"]} #${selectedItem["typeName"]} - R$ ${selectedItem["value"].toFixed(2)}?`}
                />
            }

            <ExpenseModal 
                isOpen={isExpenseModalOpen}
                onClose={onCloseModal}
                expense={selectedItem}
                reload={reload}
                expenseTypes={expenseTypes}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear[0].id}
            />

            <IncomeModal 
                isOpen={isIncomeModalOpen}
                onClose={onCloseModal}
                income={selectedItem}
                reload={reload}
                incomeTypes={incomeTypes}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear[0].id}
            />

            <SavingValueModal 
                isOpen={isSavingModalOpen}
                onClose={onCloseModal}
                saving={selectedItem}
                reload={reload}
                savingTypes={savingTypes}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear[0].id}
            />
        </>
    );
};

export default Home;
