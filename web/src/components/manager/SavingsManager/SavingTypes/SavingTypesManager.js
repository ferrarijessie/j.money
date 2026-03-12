import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useSavingTypes } from "../../../../hooks/savingTypes/useSavingTypes";
import { useSavingTypeDelete } from "../../../../hooks/savingTypes/useSavingTypeDelete";

import { SAVING_TYPES_MANGER_PATH } from "../../../../AppPaths";

import SavingTypeModal from "../../../common/SavingActions/SavingTypeModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import BlankState from "../../common/BlankState";

import SavingTypesTable from "./SavingTypesTable";


const SavingTypesManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedSavingType, setSelectedSavingType] = React.useState(null);

    const { mutateAsync: deleteSavingTypeRequest } = useSavingTypeDelete();

    const {
        isLoading, 
        error, 
        data = [],
        refetch: reload
    } = useSavingTypes();

    const onCloseModal = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedSavingType(null);
    };

    const onClickEdit = (savingType) => {
        setSelectedSavingType(savingType);
        setIsModalOpen(true);
    };

    const onClickDelete = (savingType) => {
        setSelectedSavingType(savingType);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        await deleteSavingTypeRequest(selectedSavingType["id"]);
        await reload();
        onCloseModal();
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={SAVING_TYPES_MANGER_PATH} 
                itemTitle={"Saving Types"}
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
                        <SavingTypesTable 
                            data={data} 
                            onClickEdit={onClickEdit} 
                            onClickDelete={onClickDelete} 
                        />
                    :
                        <BlankState />
                    }
                </Block>
                
            </ManagerSubPage>

            <SavingTypeModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reload={reload}
                savingType={selectedSavingType}
            />

            {selectedSavingType && 
                <ConfirmActionModal 
                    isOpen={isConfirmModalOpen}
                    onClose={onCloseModal}
                    onConfirmClick={onConfirmDelete}
                    title="Delete Saving Type"
                    content={`Are you sure you want to delete Saving Type #${selectedSavingType["id"]} - ${selectedSavingType["name"]} and all the savings attached to it?`}
                />
            }
        </>
    );
};

export default SavingTypesManager;