import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVINGS_URL } from '../endpoints';

export const fetchSavings = async (year, month) => {
    const res = await axios.get(`${SAVINGS_URL}/summary/${year}/${month}`, getHeader());
    return res.data;
};

export const useSavingsList = (year, month) => {
    return useQuery({
        queryKey: ['savingsList', year, month], 
        queryFn: () => {return fetchSavings(year, month)}
    });
};
