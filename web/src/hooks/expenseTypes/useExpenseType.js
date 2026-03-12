import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, EXPENSE_TYPES_URL } from '../endpoints';

export const fetchExpenseType = async (expenseTypeId) => {
    const res = await axios.get(`${EXPENSE_TYPES_URL}/${expenseTypeId}`, getHeader());
    return res.data;
};

export const useExpenseType = (expenseTypeId) => {
    return useQuery({
        queryKey: ['expenseType', expenseTypeId], 
        queryFn: () => {return fetchExpenseType(expenseTypeId)}
    });
};
