import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SUMMARY_URL } from '../endpoints';

export const fetchSummaryList = async (year, month) => {
    const res = await axios.get(`${SUMMARY_URL}/list/${year}/${month}`, getHeader());
    return res.data;
};

export const useSummaryList = (year, month) => {
    return useQuery({
        queryKey: ['summaryList', year, month], 
        queryFn: () => {return fetchSummaryList(year, month)}
    });
};
