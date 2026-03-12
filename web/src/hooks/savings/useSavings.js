import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVINGS_URL } from '../endpoints';

export const fetchSavings = async () => {
    const res = await axios.get(`${SAVINGS_URL}/`, getHeader());
    return res.data;
};

export const useSavings = () => {
    return useQuery({
        queryKey: ['savings'], 
        queryFn: () => {return fetchSavings()}
    });
};