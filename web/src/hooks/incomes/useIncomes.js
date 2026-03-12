import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, INCOMES_URL } from '../endpoints';

export const fetchIncomes = async () => {
    const res = await axios.get(`${INCOMES_URL}/`, getHeader());
    return res.data;
};

export const useIncomes = () => {
    return useQuery({
        queryKey: ['incomes'], 
        queryFn: () => {return fetchIncomes()}
    });
};
