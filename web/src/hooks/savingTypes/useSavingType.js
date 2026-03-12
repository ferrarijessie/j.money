import { useQuery } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVING_TYPES_URL } from '../endpoints';

export const fetchSavingType = async (savingTypeId) => {
    const res = await axios.get(`${SAVING_TYPES_URL}/${savingTypeId}`, getHeader());
    return res.data;
};

export const useSavingType = (savingTypeId) => {
    return useQuery({
        queryKey: ['savingType', savingTypeId], 
        queryFn: () => {return fetchSavingType(savingTypeId)}
    });
};
