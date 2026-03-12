import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, EXPENSES_URL } from '../endpoints';

export const fetchExpenses = async () => {
    const res = await axios.get(`${EXPENSES_URL}/`, getHeader());
    return res.data;
};

export const useExpenses = () => {
    return useQuery({
        queryKey: ['expenses'], 
        queryFn: () => {return fetchExpenses()}
    });
};
