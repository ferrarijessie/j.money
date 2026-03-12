import React from "react";
import moment from "moment";

import { useNavigate } from "react-router-dom";

import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Tile, StyledParagraph } from "baseui/tile";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyBills, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import SavingsLineChart from "../../common/metrics/SavingsLineChart";
import CategoryMetrics from "../../common/metrics/CategoryMetrics";

import { 
    SAVINGS_MANAGER_PATH, 
    SAVING_TYPES_MANGER_PATH, 
    SAVING_VALUES_MANAGER_PATH,
} from "../../../AppPaths";

import { useSavingTypes } from "../../../hooks/savingTypes/useSavingTypes";
import { useSavings } from "../../../hooks/savings/useSavings";
import { useSavingsList } from "../../../hooks/savings/useSavingsList";

import { TagsContainerUI } from "../common/styled";
import { 
    managerSummaryGridOverrides,
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";


const SavingsManager = () => {

    const navigate = useNavigate();

    const {
        isLoading: isTypesLoading, 
        error: typesError, 
        data: typesData = [],
        refetch: reloadTypes
    } = useSavingTypes();

    const {
        isLoading: isSavingsLoading, 
        error: incomesError, 
        data: savingsData = [],
        refetch: reloadSavings
    } = useSavings();

    const {
        isLoading: isSavingsListLoading, 
        error: savingsListError, 
        data: savingsListData = [],
        refetch: reloadSavingsList
    } = useSavingsList(
        moment().format('Y'),
        moment().format('M')
    );

    // Calculate monthly totals per category using category string
    const categoryMonthTotals = savingsListData
        .reduce((acc, saving) => {
            const categoryName = saving.name;
            const value = saving.currentMonthValue;
            acc[categoryName] = value;
            return acc;
    }, {});

    // Calculate balance totals per category using category string
    const categoryBalanceTotals = savingsListData
        .reduce((acc, saving) => {
            const categoryName = saving.name;
            const value = saving.balance + saving.currentMonthValue;
            acc[categoryName] = value;
            return acc;
    }, {});



    return (
        <ManagerSubPage 
            activeItem={SAVINGS_MANAGER_PATH}
            itemTitle={"Savings"}
        >  
            <TagsContainerUI>
                {isSavingsLoading && isTypesLoading ?
                    <>
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="200px"
                            animation
                        />
                        <Skeleton
                            rows={0}
                            height="100px"
                            width="200px"
                            animation
                        />
                    </>
                :
                    <>
                        <Tile
                            label="Saving Types"
                            leadingContent={() => <FontAwesomeIcon icon={faReceipt} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(SAVING_TYPES_MANGER_PATH)}
                        >
                            <StyledParagraph>{typesData.length}</StyledParagraph>
                        </Tile>
                        <Tile
                            label="Saving Values"
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(SAVING_VALUES_MANAGER_PATH)}
                            >
                            <StyledParagraph>{savingsData.length}</StyledParagraph>
                        </Tile>
                    </>
                }
            </TagsContainerUI>
            
            <FlexGrid flexGridColumnCount={1} {...managerSummaryGridOverrides}>
                <FlexGridItem>
                <FlexGrid flexGridColumnCount={2} gap="scale800" style={{ marginTop: '20px' }}>
                    <FlexGridItem>
                        <CategoryMetrics 
                            totals={categoryMonthTotals}
                            title="Monthly Totals"
                        />
                    </FlexGridItem> 
                    <FlexGridItem  style={{ borderLeft: '1px solid #ccc' }}>
                        <CategoryMetrics 
                            totals={categoryBalanceTotals}
                            title="Balance Totals"
                        />
                    </FlexGridItem> 
                </FlexGrid>
                </FlexGridItem>
                <FlexGridItem>
                    <FlexGrid flexGridColumnCount={1} gap="scale800" style={{ marginTop: '20px' }}>
                        <FlexGridItem>
                            <SavingsLineChart savingsData={savingsData} />
                        </FlexGridItem>
                    </FlexGrid>
                </FlexGridItem>
            </FlexGrid>
            
        </ManagerSubPage>
    );
};

export default SavingsManager;