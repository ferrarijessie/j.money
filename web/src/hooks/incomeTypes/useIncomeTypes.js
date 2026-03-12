import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, INCOME_TYPES_URL } from '../endpoints';

export const fetchIncomeTypes = async () => {
    const res = await axios.get(INCOME_TYPES_URL, getHeader());
    return res.data;
};

export const useIncomeTypes = () => {
    return useQuery({
        queryKey: ['incomeTypes'], 
        queryFn: fetchIncomeTypes
    });
};
