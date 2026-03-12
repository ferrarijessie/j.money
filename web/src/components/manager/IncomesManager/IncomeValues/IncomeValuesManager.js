import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { INCOME_VALUES_MANAGER_PATH } from "../../../../AppPaths";

import { useIncomes } from "../../../../hooks/incomes/useIncomes";
import { useIncomeDelete } from "../../../../hooks/incomes/useIncomeDelete";
import { useIncomeTypes } from "../../../../hooks/incomeTypes/useIncomeTypes";

import IncomeModal from "../../../common/IncomeActions/IncomeModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import BlankState from "../../common/BlankState";

import IncomeValuesTable from "./IncomeValuesTable";


const IncomeValuesManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedIncome, setSelectedIncome] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: deleteIncomeRequest } = useIncomeDelete();

    const {
        isLoading, 
        error, 
        data = [],
        refetch: reload
    } = useIncomes();

    const {
        data: incomeTypesData = []
    } = useIncomeTypes();

    const onCloseModal = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedIncome(null);
    };

    const onClickEdit = (income) => {
        setSelectedIncome(income);
        setIsModalOpen(true);
    };

    const onClickDelete = (income) => {
        setSelectedIncome(income);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        setIsSaveLoading(true);

        await deleteIncomeRequest(selectedIncome["id"]);
        await reload();
        onCloseModal();

        setIsSaveLoading(false);
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={INCOME_VALUES_MANAGER_PATH} 
                itemTitle={"Inocme Values"}
                actions={
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        startEnhancer={<FontAwesomeIcon icon={faPlus} />}
                        size={SIZE.compact}
                    >
                        New
                    </Button>
                }
            >
                <Block>
                    {isLoading &&
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="100%"
                            animation
                        />
                    }
                    {data.length > 0 ?
                        <IncomeValuesTable 
                            incomesData={data} 
                            onClickEdit={onClickEdit} 
                            onClickDelete={onClickDelete} 
                            reload={reload}
                        />
                    :
                        <BlankState />
                    }
                </Block>

            </ManagerSubPage>

            {selectedIncome &&
                <>
                    <ConfirmActionModal 
                        isOpen={isConfirmModalOpen}
                        onClose={onCloseModal}
                        onConfirmClick={onConfirmDelete}
                        title="Delete Income"
                        content={`Are you sure you want to delete Income ${selectedIncome["typeName"]} - ${selectedIncome["month"]}/${selectedIncome["year"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <IncomeModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reload={reload}
                incomeTypes={incomeTypesData}
                isLoading={isSaveLoading}
                income={selectedIncome}
            />
        </>
    );
};

export default IncomeValuesManager;