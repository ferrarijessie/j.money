import React from "react";
import { useParams } from 'react-router';

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useSavingType } from "../../../../hooks/savingTypes/useSavingType";
import { useSavingDelete } from "../../../../hooks/savings/useSavingDelete";

import { SAVING_TYPES_MANGER_PATH } from "../../../../AppPaths";

import ManagerSubPage from "../../ManagerSubPage";
import SavingTypeModal from "../../../common/SavingActions/SavingTypeModal";
import SavingValuesTable from "../SavingValues/SavingValuesTable";
import SavingValueModal from "../../../common/SavingActions/SavingValueModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import { 
    buttonGridOverrides,
    detailsGridOverrides, 
} from "../../common/overrides";

import { DetailsLabelTextUI, DetailsTextUI } from "../../common/styled";


const SavingTypeDetails = () => {

    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isSavingModalOpen, setIsSavingModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedSaving, setSelectedSaving] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: deleteSavingRequest } = useSavingDelete();

    const {
        data: savingTypeData = {},
        isLoading,
        refetch: reload
    } = useSavingType(id);

    const onCloseModal = () => {
        setIsSavingModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedSaving(null);
    };

    const onClickEdit = (saving) => {
        setSelectedSaving(saving);
        setIsSavingModalOpen(true);
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

    if (!!isLoading || !!isSaveLoading) {
        return (
            <ManagerSubPage 
                activeItem={SAVING_TYPES_MANGER_PATH} 
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
                activeItem={SAVING_TYPES_MANGER_PATH} 
                itemTitle={`#${savingTypeData.id} ${savingTypeData.name}`}
                actions={
                    <>
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPencil} />}
                            size={SIZE.compact}
                        >
                                Edit
                        </Button>
                        <Button 
                            onClick={() => setIsSavingModalOpen(true)}
                            startEnhancer={<FontAwesomeIcon icon={faPlus} />}
                            size={SIZE.compact}
                        >
                                Add Value
                        </Button>
                    </>
                }
            >

                <Block>
                    <FlexGrid flexGridColumnCount={2} {...detailsGridOverrides}>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Active</DetailsLabelTextUI>
                            <DetailsTextUI>{savingTypeData.active ? 'Yes' : 'No'}</DetailsTextUI>
                        </FlexGridItem>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Base Value</DetailsLabelTextUI>
                            <DetailsTextUI>{!!savingTypeData.baseValue ? `R$ ${savingTypeData.baseValue.toFixed(2)}` : '-'}</DetailsTextUI>
                        </FlexGridItem>
                    </FlexGrid>
                    <SavingValuesTable 
                        savingsData={savingTypeData.savingValues} 
                        onClickEdit={onClickEdit} 
                        onClickDelete={onClickDelete} 
                        reload={reload}
                    />
                </Block>
            </ManagerSubPage>

            {!!selectedSaving &&
                <>
                    <ConfirmActionModal 
                        isOpen={isConfirmModalOpen}
                        onClose={onCloseModal}
                        onConfirmClick={onConfirmDelete}
                        title="Delete Saving"
                        content={`Are you sure you want to delete Saving ${selectedSaving["month"]}/${selectedSaving["year"]} - R$${selectedSaving["value"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <SavingValueModal 
                isOpen={isSavingModalOpen}
                onClose={onCloseModal}
                reload={reload}
                savingTypes={[savingTypeData]}
                savingTypeInitial={savingTypeData} 
                saving={selectedSaving}
            />

            <SavingTypeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reload={reload}
                savingType={savingTypeData}
            />
        </>
    )

};

export default SavingTypeDetails;
