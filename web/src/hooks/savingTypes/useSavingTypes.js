import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVING_TYPES_URL } from '../endpoints';

export const fetchSavingTypes = async () => {
    const res = await axios.get(SAVING_TYPES_URL, getHeader());
    return res.data;
};

export const useSavingTypes = () => {
    return useQuery({
        queryKey: ['savingTypes'], 
        queryFn: fetchSavingTypes
    });
};
