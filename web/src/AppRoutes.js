import React from "react";
import { 
    Route, 
    Routes 
} from "react-router-dom";

import Home from "./components/home/Home";
import Manager from "./components/manager/Manager";

import ProfileManager from "./components/manager/ProfileManager/ProfileManager";

import ExpenseManager from "./components/manager/ExpensesManager/ExpensesManager";
import ExpenseTypeManager from "./components/manager/ExpensesManager/ExpenseTypes/ExpenseTypesManager";
import ExpenseTypeDetails from "./components/manager/ExpensesManager/ExpenseTypes/ExpenseTypeDetails";
import ExpenseValuesManager from "./components/manager/ExpensesManager/ExpenseValues/ExpenseValuesManager";

import IncomesManager from "./components/manager/IncomesManager/IncomesManager";
import IncomeTypesManager from "./components/manager/IncomesManager/IncomeTypes/IncomeTypesManager";
import IncomeTypeDetails from "./components/manager/IncomesManager/IncomeTypes/IncomeTypeDetails";
import IncomeValuesManager from "./components/manager/IncomesManager/IncomeValues/IncomeValuesManager";

import SavingsManager from "./components/manager/SavingsManager/SavingsManager";
import SavingTypesManager from "./components/manager/SavingsManager/SavingTypes/SavingTypesManager";
import SavingTypeDetails from "./components/manager/SavingsManager/SavingTypes/SavingTypeDetails";
import SavingValuesManager from "./components/manager/SavingsManager/SavingValues/SavingValuesManager";

import {
    MANAGER_PATH, PROFILE_MANAGER_PATH,
    EXPENSES_MANAGER_PATH, EXPENSE_TYPES_MANAGER_PATH, EXPENSE_TYPE_DETAILS_PATH, EXPENSE_VALUES_MANAGER_PATH,
    INCOMES_MANAGER_PATH, INCOME_TYPES_MANAGER_PATH, INCOME_TYPE_DETAILS_PATH, INCOME_VALUES_MANAGER_PATH,
    SAVINGS_MANAGER_PATH, SAVING_TYPES_MANGER_PATH, SAVING_TYPE_DETAILS_PATH, SAVING_VALUES_MANAGER_PATH
} from "./AppPaths";


const AppRoutes = () => {
   return(
       <Routes>
            <Route path="/" element={ <Home /> } />

            <Route path={MANAGER_PATH} element={ <Manager /> } />

            <Route path={PROFILE_MANAGER_PATH} element={ <ProfileManager /> } />

            <Route path={EXPENSES_MANAGER_PATH} element={ <ExpenseManager /> } />
            <Route path={EXPENSE_TYPES_MANAGER_PATH} element={ <ExpenseTypeManager /> } />
            <Route path={EXPENSE_TYPE_DETAILS_PATH} element={ <ExpenseTypeDetails /> } />
            <Route path={EXPENSE_VALUES_MANAGER_PATH} element={ <ExpenseValuesManager /> } />

            <Route path={INCOMES_MANAGER_PATH} element={ <IncomesManager /> } />
            <Route path={INCOME_TYPES_MANAGER_PATH} element={ <IncomeTypesManager /> } />
            <Route path={INCOME_TYPE_DETAILS_PATH} element={ <IncomeTypeDetails /> } />
            <Route path={INCOME_VALUES_MANAGER_PATH} element={ <IncomeValuesManager /> } />

            <Route path={SAVINGS_MANAGER_PATH} element={ <SavingsManager /> } />
            <Route path={SAVING_TYPES_MANGER_PATH} element={ <SavingTypesManager /> } />
            <Route path={SAVING_TYPE_DETAILS_PATH} element={ <SavingTypeDetails /> } />
            <Route path={SAVING_VALUES_MANAGER_PATH} element={ <SavingValuesManager /> } />

        </Routes>
   )
}

export default AppRoutes;