import React from "react";
import { useParams } from 'react-router';

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Button, SIZE } from "baseui/button";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faPlus } from '@fortawesome/free-solid-svg-icons';

import { useIncomeType } from "../../../../hooks/incomeTypes/useIncomeType";
import { useIncomeDelete } from "../../../../hooks/incomes/useIncomeDelete";

import { INCOME_TYPES_MANAGER_PATH } from "../../../../AppPaths";

import ManagerSubPage from "../../ManagerSubPage";
import IncomeTypeModal from "../../../common/IncomeActions/IncomeTypeModal";
import IncomeValuesTable from "../IncomeValues/IncomeValuesTable";
import IncomeModal from "../../../common/IncomeActions/IncomeModal";
import ConfirmActionModal from "../../../common/ConfirmActionModal";

import { 
    buttonGridOverrides,
    detailsGridOverrides, 
} from "../../common/overrides";

import { DetailsLabelTextUI, DetailsTextUI } from "../../common/styled";


const IncomeTypeDetails = () => {

    const { id } = useParams();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = React.useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [selectedIncome, setSelectedIncome] = React.useState(null);
    const [isSaveLoading, setIsSaveLoading] = React.useState(false);

    const { mutateAsync: deleteIncomeRequest } = useIncomeDelete();

    const {
        data: incomeTypeData = {},
        isLoading,
        refetch: reload
    } = useIncomeType(id);

    const onCloseModal = () => {
        setIsIncomeModalOpen(false);
        setIsConfirmModalOpen(false);
        setSelectedIncome(null);
    };

    const onClickEdit = (income) => {
        setSelectedIncome(income);
        setIsIncomeModalOpen(true);
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

    if (isLoading) {
        return (
            <ManagerSubPage 
                activeItem={INCOME_TYPES_MANAGER_PATH} 
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
                activeItem={INCOME_TYPES_MANAGER_PATH} 
                itemTitle={`#${incomeTypeData.incomeTypeId} ${incomeTypeData.name}`}
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
                            onClick={() => setIsIncomeModalOpen(true)}
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
                            <DetailsLabelTextUI>Recurrent</DetailsLabelTextUI>
                            <DetailsTextUI>{incomeTypeData.recurrent ? 'Yes' : 'No'}</DetailsTextUI>
                        </FlexGridItem>
                        <FlexGridItem>
                            <DetailsLabelTextUI>Base Value</DetailsLabelTextUI>
                            <DetailsTextUI>{!!incomeTypeData.recurrent ? `R$ ${incomeTypeData.baseValue.toFixed(2)}` : '-'}</DetailsTextUI>
                        </FlexGridItem>
                    </FlexGrid>
                    <IncomeValuesTable 
                        incomesData={incomeTypeData.incomeValues} 
                        onClickEdit={onClickEdit} 
                        onClickDelete={onClickDelete} 
                        reload={reload}
                    />
                </Block>
            </ManagerSubPage>

            {!!selectedIncome &&
                <>
                    <ConfirmActionModal 
                        isOpen={isConfirmModalOpen}
                        onClose={onCloseModal}
                        onConfirmClick={onConfirmDelete}
                        title="Delete Income"
                        content={`Are you sure you want to delete Income ${selectedIncome["month"]}/${selectedIncome["year"]} - R$${selectedIncome["value"]}?`}
                        isLoading={isSaveLoading}
                    />
                </>
            }

            <IncomeModal 
                isOpen={isIncomeModalOpen}
                onClose={onCloseModal}
                reload={reload}
                incomeTypes={[incomeTypeData]}
                incomeTypeInitial={incomeTypeData} 
                income={selectedIncome}
            />

            <IncomeTypeModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reload={reload}
                incomeType={incomeTypeData}
            />
        </>
    )

};

export default IncomeTypeDetails;
