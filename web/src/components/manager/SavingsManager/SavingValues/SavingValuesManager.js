import React from "react";
import { Block } from "baseui/block";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { SAVING_VALUES_MANAGER_PATH } from "../../../../AppPaths";

import { useSavings } from "../../../../hooks/savings/useSavings";
import { useSavingDelete } from "../../../../hooks/savings/useSavingDelete";
import { useSavingTypes } from "../../../../hooks/savingTypes/useSavingTypes";

import SavingValueModal from "../../../common/SavingActions/SavingValueModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import ManagerSubPage from "../../ManagerSubPage";
import BlankState from "../../common/BlankState";

import SavingValuesTable from "./SavingValuesTable";


const SavingValuesManager = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedSaving, setSelectedSaving] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: deleteSavingRequest } = useSavingDelete();

    const {
        isLoading, 
        error, 
        data = [],
        refetch: reload
    } = useSavings();

    const {
        data: savingTypesData = []
    } = useSavingTypes();

    const onCloseModal = () => {
        setIsModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedSaving(null);
    };

    const onClickEdit = (saving) => {
        setSelectedSaving(saving);
        setIsModalOpen(true);
    };

    const onClickDelete = (saving) => {
        setSelectedSaving(saving);
        setIsConfirmModalOpen(true);
    };

    const onConfirmDelete = async () => {
        setIsSaveLoading(true);

        await deleteSavingRequest(selectedSaving["id"]);
        setSelectedSaving(null);
        await reload();
        onCloseModal();

        setIsSaveLoading(false);
    };

    return (
        <>
            <ManagerSubPage 
                activeItem={SAVING_VALUES_MANAGER_PATH} 
                itemTitle={"Saving Values"}
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
                        <SavingValuesTable 
                            savingsData={data} 
                            onClickEdit={onClickEdit} 
                            onClickDelete={onClickDelete} 
                            reload={reload}
                        />
                    :
                        <BlankState />
                    }
                </Block>

            </ManagerSubPage>

            {selectedSaving &&
                <>
                    <ConfirmActionModal 
                        isOpen={isConfirmModalOpen}
                        onClose={onCloseModal}
                        onConfirmClick={onConfirmDelete}
                        title="Delete Saving"
                        content={`Are you sure you want to delete Saving ${selectedSaving["typeName"]} - ${selectedSaving["month"]}/${selectedSaving["year"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <SavingValueModal 
                isOpen={isModalOpen}
                onClose={onCloseModal}
                reload={reload}
                savingTypes={savingTypesData}
                isLoading={isSaveLoading}
                saving={selectedSaving}
            />
        </>
    );
};

export default SavingValuesManager;