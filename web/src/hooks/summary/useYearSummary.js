import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SUMMARY_URL } from '../endpoints';

export const fetchYearlySummary = async (year) => {
    const res = await axios.get(`${SUMMARY_URL}/year/${year}`, getHeader());
    return res.data;
};

export const useYearlySummary = (year) => {
    return useQuery({
        queryKey: ['summaryYearly', year], 
        queryFn: () => {return fetchYearlySummary(year)}
    });
};
