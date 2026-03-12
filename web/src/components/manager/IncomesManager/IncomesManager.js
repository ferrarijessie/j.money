import React from "react";
import moment from "moment";

import { useNavigate } from "react-router-dom";

import { Tile, StyledParagraph } from "baseui/tile";
import { Skeleton } from "baseui/skeleton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faMoneyBills, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import RecurrentMetrics from "../../common/metrics/RecurrentMetrics";
import CategoryMetrics from "../../common/metrics/CategoryMetrics";

import { 
    INCOMES_MANAGER_PATH, 
    INCOME_TYPES_MANAGER_PATH, 
    INCOME_VALUES_MANAGER_PATH,
} from "../../../AppPaths";

import { useIncomeTypes } from "../../../hooks/incomeTypes/useIncomeTypes";
import { useIncomes } from "../../../hooks/incomes/useIncomes";
import { useIncomesList } from "../../../hooks/incomes/useIncomesList";

import { TagsContainerUI } from "../common/styled";
import { 
    managerSummaryGridOverrides,
} from "../common/overrides";

import ManagerSubPage from "../ManagerSubPage";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";


const IncomesManager = () => {

    const navigate = useNavigate();
    const currentYear = moment().format('Y');
    const currentMonth = moment().format('M');

    const {
        isLoading: isTypesLoading, 
        error: typesError, 
        data: typesData = [],
        refetch: reloadTypes
    } = useIncomeTypes();

    const {
        isLoading: isIncomesLoading, 
        error: incomesError, 
        data: incomesData = [],
        refetch: reloadIncomes
    } = useIncomes();

    const {
        isLoading: isIncomesListLoading, 
        error: incomesListError, 
        data: incomesListData = [],
        refetch: reloadIncomesList
    } = useIncomesList(
        moment().format('Y'),
        moment().format('M')
    );

    return (
        <ManagerSubPage 
            activeItem={INCOMES_MANAGER_PATH}
            itemTitle={"Incomes"}
        >  
            <TagsContainerUI>
                {isIncomesLoading && isTypesLoading ?
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
                            label="Income Types"
                            leadingContent={() => <FontAwesomeIcon icon={faReceipt} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(INCOME_TYPES_MANAGER_PATH)}
                        >
                            <StyledParagraph>{typesData.length}</StyledParagraph>
                        </Tile>
                        <Tile
                            label="Income Values"
                            leadingContent={() => <FontAwesomeIcon icon={faMoneyBills} size="2xl" />}
                            trailingContent={() => <FontAwesomeIcon icon={faChevronRight} />}
                            onClick={() => navigate(INCOME_VALUES_MANAGER_PATH)}
                            >
                            <StyledParagraph>{incomesData.length}</StyledParagraph>
                        </Tile>
                    </>
                }
            </TagsContainerUI>
            
            <FlexGrid flexGridColumnCount={1} {...managerSummaryGridOverrides}>
                <FlexGridItem>
                    <FlexGrid flexGridColumnCount={2} gap="scale800" style={{ marginTop: '20px' }}>
                        <FlexGridItem>
                            <RecurrentMetrics 
                                recurrentTotal={incomesListData
                                    .filter(income => 
                                        income.year+'' === currentYear && income.month+'' === currentMonth && 
                                        typesData.find(type => type.id === income.typeId)?.recurrent
                                    )
                                    .reduce((acc, p) => acc + p.value, 0)
                                }
                                nonRecurrentTotal={incomesListData
                                    .filter(income => 
                                        income.year+'' === currentYear && income.month+'' === currentMonth && 
                                        !typesData.find(type => type.id === income.typeId)?.recurrent
                                    )
                                    .reduce((acc, p) => acc + p.value, 0)
                                }
                            />
                        </FlexGridItem>
                        <FlexGridItem style={{ borderLeft: '1px solid #ccc' }}>
                            <CategoryMetrics 
                                totals={incomesListData
                                    .filter(income => 
                                        income.year+'' === currentYear && income.month+'' === currentMonth
                                    )
                                    .reduce((acc, income) => {
                                    acc[income.typeName] = (acc[income.typeName] || 0) + income.value;
                                    return acc;
                                }, {})}
                            />
                        </FlexGridItem>
                    </FlexGrid>
                </FlexGridItem>
            </FlexGrid>
            
        </ManagerSubPage>
    );
};

export default IncomesManager;