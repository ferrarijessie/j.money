import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, INCOMES_URL } from '../endpoints';

export const fetchIncomesList = async (year, month) => {
    const res = await axios.get(`${INCOMES_URL}/${year}/${month}`, getHeader());
    return res.data;
};

export const useIncomesList = (year, month) => {
    return useQuery({
        queryKey: ['incomesList', year, month], 
        queryFn: () => {return fetchIncomesList(year, month)}
    });
};
