export const getHeader = () => {
    const tokenString = sessionStorage.getItem('token');
    return {headers: {"X-api-key": JSON.parse(tokenString)}};
};

export const API_BASE_URL = "/api";


// EXPENSES
export const EXPENSE_TYPES_URL = `${API_BASE_URL}/expense/type`;
export const EXPENSES_URL = `${API_BASE_URL}/expense`;


// INCOMES
export const INCOME_TYPES_URL = `${API_BASE_URL}/income/type`;
export const INCOMES_URL = `${API_BASE_URL}/income`;


// SAVINGS
export const SAVING_TYPES_URL = `${API_BASE_URL}/saving/type`;
export const SAVINGS_URL = `${API_BASE_URL}/saving`;


// SUMMARY
export const SUMMARY_URL = `${API_BASE_URL}/summary`;
export const SAVINGS_SUMMARY_URL = `${API_BASE_URL}/saving/summary`


// AUTH
export const AUTH_URL = `${API_BASE_URL}/auth`;
export const LOGIN_URL = `${AUTH_URL}/login`;
export const SIGNUP_URL = `${AUTH_URL}/signup`;
export const USER_URL = `${AUTH_URL}/user`;
