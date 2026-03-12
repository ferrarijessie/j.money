import React from "react";
import { useParams } from 'react-router';

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useExpenseType } from "../../../../hooks/expenseTypes/useExpenseType";
import { useExpenseDelete } from "../../../../hooks/expenses/useExpenseDelete";

import { EXPENSE_TYPES_MANAGER_PATH } from "../../../../AppPaths";

import ManagerSubPage from "../../ManagerSubPage";
import ExpenseTypeModal from "../../../common/ExpensesActions/ExpenseTypeModal";
import ExpenseTable from "../ExpenseValues/ExpenseTable";
import ExpenseModal from "../../../common/ExpensesActions/ExpenseModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import { 
    buttonGridOverrides,
    detailsGridOverrides, 
} from "../../common/overrides";

import { DetailsLabelTextUI, DetailsTextUI } from "../../common/styled";


const ExpenseTypeDetails = () => {

    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedExpense, setSelectedExpense] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: deleteExpenseRequest } = useExpenseDelete();

    const {
        data: expenseTypeData = {},
        isLoading,
        refetch: reload
    } = useExpenseType(id);

    const onCloseModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setIsConfirmModalOpen(false);
    };

    const onClickEdit = (expense) => {
        setSelectedExpense(expense);
        setIsModalOpen(true);
    };

    const onClickDelete = (expense) => {
        setSelectedExpense(expense);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        setIsSaveLoading(true);

        await deleteExpenseRequest(selectedExpense["id"]);
        await reload();

        setSelectedExpense(null);
        setIsSaveLoading(false);
        
        onCloseModal();
    };

    if (!!isLoading || !!isSaveLoading) {
        return (
            <ManagerSubPage 
                activeItem={EXPENSE_TYPES_MANAGER_PATH} 
            >
                <FlexGrid flexGridColumnCount={2}>
                    <FlexGridItem>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="100%"
                            animation
                        />
                    </FlexGridItem>
                    <FlexGridItem {...buttonGridOverrides}>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="100%"
                            animation
                        />
                    </FlexGridItem>
                </FlexGrid>
            </ManagerSubPage>
        );
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={EXPENSE_TYPES_MANAGER_PATH} 
                itemTitle={`#${expenseTypeData.id} ${expenseTypeData.name}`}
                actions={
                    <>
                        <Button 
                            onClick={() => setIsEditModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPencil} />}
                            size={SIZE.compact}
                        >
                                Edit
                        </Button>
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPlus} />}
                            size={SIZE.compact}
                        >
                                Add Value
                        </Button>
                    </>
                }
            >

                <Block>
                    <FlexGrid flexGridColumnCount={3} {...detailsGridOverrides}>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Category</DetailsLabelTextUI>
                            <DetailsTextUI>{expenseTypeData.category.toUpperCase()}</DetailsTextUI>
                        </FlexGridItem>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Recurrent</DetailsLabelTextUI>
                            <DetailsTextUI>{expenseTypeData.recurrent ? 'Yes' : 'No'}</DetailsTextUI>
                        </FlexGridItem>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Base Value</DetailsLabelTextUI>
                            <DetailsTextUI>{!!expenseTypeData.recurrent ? `R$ ${expenseTypeData.baseValue.toFixed(2)}` : '-'}</DetailsTextUI>
                        </FlexGridItem>
                    </FlexGrid>
                    <ExpenseTable 
                        expensesData={expenseTypeData.expenseValues} 
                        onClickEdit={onClickEdit} 
                        onClickDelete={onClickDelete} 
                        reload={reload}
                    />
                </Block>
            </ManagerSubPage>

            {!!selectedExpense &&
                <>
                    <ConfirmActionModal 
                        isOpen={isConfirmModalOpen}
                        onClose={onCloseModal}
                        onConfirmClick={onConfirmDelete}
                        title="Delete Expense"
                        content={`Are you sure you want to delete Expense ${selectedExpense["month"]}/${selectedExpense["year"]} - R$${selectedExpense["value"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <ExpenseModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reload={reload}
                expenseTypes={[expenseTypeData]}
                expenseTypeInitial={expenseTypeData} 
                expense={selectedExpense}
            />

            <ExpenseTypeModal 
                isOpen={isEditModalOpen}
                onClose={onCloseModal}
                reload={reload}
                expenseType={expenseTypeData}
            />
        </>
    )

};

export default ExpenseTypeDetails;
