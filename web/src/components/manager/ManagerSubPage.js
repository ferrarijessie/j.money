import React from "react";

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

import { Navigation } from "baseui/side-navigation";
import { Block } from "baseui/block";
import { Heading, HeadingLevel } from 'baseui/heading';
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { StyledLink } from "baseui/link";
import { styled } from "styletron-react";

import { 
    EXPENSES_MANAGER_PATH, EXPENSE_TYPES_MANAGER_PATH, EXPENSE_VALUES_MANAGER_PATH,
    INCOMES_MANAGER_PATH, INCOME_TYPES_MANAGER_PATH, INCOME_VALUES_MANAGER_PATH,
    SAVINGS_MANAGER_PATH, SAVING_TYPES_MANGER_PATH, SAVING_VALUES_MANAGER_PATH,
    PROFILE_MANAGER_PATH, MANAGER_PATH
} from "../../AppPaths";

import AppNavigation from "../common/AppNavigation";
import Footer from "../common/Footer";

import { 
    headingOverrides,
    headingGridOverrides,
    subHeadingOverrides,
    subHeadingGridOverrides,
    buttonGridOverrides,
    sideMenuGridOverrides,
    childrenGridOverrides,
    bodyGridOverrides,
} from "./common/overrides";


const ContainerUI = styled(Block, {
    padding: "0px 160px",
});

const LinkUI = styled(StyledLink, {
    textDecoration: "none !important",
    color: "#000000 !important",
    ":hover": {
        color: "#5f0488 !important",
    },
});

const navigationOverrides = {
    overrides: {
        NavItem: {
            style: ({ $active }) => {
                if (!$active)
                    return {
                        ":hover": {
                            backgroundColor: "#F3F3F3",
                        },
                    };
                return {
                    backgroundColor: "#6c6c6c",
                    borderLeftColor: "#000000",
                    color: "#000000",
                    ":hover": {
                        color: "#5f0488",
                    },
                };
            },
        },
    }
};


const ManagerSubPage = ({
    children,
    activeItem = null,
    actions=null,
    itemTitle=""
}) => {
    const navigate = useNavigate();

    const [activeItemId, setActiveItemId] = React.useState(activeItem);

    return (
        <>
            <AppNavigation />

            <ContainerUI>
                <FlexGrid {...headingGridOverrides}>
                    <FlexGridItem>
                        <HeadingLevel>
                            <HeadingLevel>
                                <HeadingLevel>
                                    <Heading {...headingOverrides}>
                                        <LinkUI href={`${MANAGER_PATH}`}>
                                            <FontAwesomeIcon transform="left-4" icon={faGear} />
                                            Manager
                                        </LinkUI>
                                    </Heading>
                                </HeadingLevel>
                            </HeadingLevel>
                        </HeadingLevel>
                    </FlexGridItem>
                </FlexGrid>

                <FlexGrid flexGridColumnCount={2} {...bodyGridOverrides} >
                    <FlexGridItem {...sideMenuGridOverrides}>
                    <Navigation
                        items={[
                            {
                                title: "Profile",
                                itemId: `${PROFILE_MANAGER_PATH}`
                            },
                            {
                                title: "Expenses",
                                itemId: `${EXPENSES_MANAGER_PATH}`,
                                subNav: [
                                    {
                                    title: "Expense Types",
                                    itemId: `${EXPENSE_TYPES_MANAGER_PATH}`
                                    },
                                    {
                                    title: "Expense Values",
                                    itemId: `${EXPENSE_VALUES_MANAGER_PATH}`,
                                    }
                                ]
                            },
                            {
                                title: "Incomes",
                                itemId: `${INCOMES_MANAGER_PATH}`,
                                subNav: [
                                    {
                                    title: "Income Types",
                                    itemId: `${INCOME_TYPES_MANAGER_PATH}`
                                    },
                                    {
                                    title: "Income Values",
                                    itemId: `${INCOME_VALUES_MANAGER_PATH}`,
                                    }
                                ]
                            },
                            {
                                title: "Savings",
                                itemId: `${SAVINGS_MANAGER_PATH}`,
                                subNav: [
                                    {
                                    title: "Saving Types",
                                    itemId: `${SAVING_TYPES_MANGER_PATH}`
                                    },
                                    {
                                    title: "Saving Values",
                                    itemId: `${SAVING_VALUES_MANAGER_PATH}`,
                                    }
                                ]
                            }
                        ]}
                        activeItemId={activeItemId}
                        onChange={({ event, item }) => {
                            // prevent page reload
                            event.preventDefault();
                            setActiveItemId(item?.itemId);
                            navigate(item?.itemId);
                        }}
                        {...navigationOverrides}
                        />
                    </FlexGridItem>
                    <FlexGridItem {...childrenGridOverrides}>  
                        {!!children && 
                            <FlexGrid flexGridColumnCount={2} {...subHeadingGridOverrides}>
                                <FlexGridItem>
                                    <HeadingLevel>
                                        <HeadingLevel>
                                            <HeadingLevel>
                                                <HeadingLevel>
                                                    <Heading {...subHeadingOverrides}>{itemTitle}</Heading>
                                                </HeadingLevel>
                                            </HeadingLevel>
                                        </HeadingLevel>
                                    </HeadingLevel>
                                </FlexGridItem>
                                <FlexGridItem {...buttonGridOverrides}>
                                    {actions}
                                </FlexGridItem>
                            </FlexGrid>
                        }
                        {children}
                    </FlexGridItem>     
                </FlexGrid>
            </ContainerUI>

            <Footer />
        </>
    );
};

export default ManagerSubPage;