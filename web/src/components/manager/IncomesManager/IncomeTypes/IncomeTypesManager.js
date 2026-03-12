import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useIncomeTypes } from "../../../../hooks/incomeTypes/useIncomeTypes";
import { useIncomeTypeDelete } from "../../../../hooks/incomeTypes/useIncomeTypeDelete";

import { INCOME_TYPES_MANAGER_PATH } from "../../../../AppPaths";

import IncomeTypeModal from "../../../common/IncomeActions/IncomeTypeModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import BlankState from "../../common/BlankState";

import IncomeTypesTable from "./IncomeTypesTable";


const IncomeTypesManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedIncomeType, setSelectedIncomeType] = React.useState(null);

    const { mutateAsync: deleteIncomeTypeRequest } = useIncomeTypeDelete();

    const {
        isLoading, 
        error, 
        data = [],
        refetch: reload
    } = useIncomeTypes();

    const onCloseModal = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedIncomeType(null);
    };

    const onClickEdit = (incomeType) => {
        setSelectedIncomeType(incomeType);
        setIsModalOpen(true);
    };

    const onClickDelete = (incomeType) => {
        setSelectedIncomeType(incomeType);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        await deleteIncomeTypeRequest(selectedIncomeType["id"]);
        await reload();
        onCloseModal();
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={INCOME_TYPES_MANAGER_PATH} 
                itemTitle={"Income Types"}
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
                        <IncomeTypesTable 
                            data={data} 
                            onClickEdit={onClickEdit} 
                            onClickDelete={onClickDelete} 
                        />
                    :
                        <BlankState />
                    }
                </Block>
                
            </ManagerSubPage>

            <IncomeTypeModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reload={reload}
                incomeType={selectedIncomeType}
            />

            {selectedIncomeType && 
                <ConfirmActionModal 
                    isOpen={isConfirmModalOpen}
                    onClose={onCloseModal}
                    onConfirmClick={onConfirmDelete}
                    title="Delete Income Type"
                    content={`Are you sure you want to delete Income Type #${selectedIncomeType["id"]} - ${selectedIncomeType["name"]} and all the incomes attached to it?`}
                />
            }
        </>
    );
};

export default IncomeTypesManager;