import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, EXPENSE_TYPES_URL } from '../endpoints';

export const fetchExpenseTypes = async () => {
    const res = await axios.get(EXPENSE_TYPES_URL, getHeader());
    return res.data;
};

export const useExpenseTypes = () => {
    return useQuery({
        queryKey: ['expenseTypes'], 
        queryFn: fetchExpenseTypes
    });
};
