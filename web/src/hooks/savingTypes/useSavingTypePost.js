import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVING_TYPES_URL } from '../endpoints';


export const addSavingType = async (payload = {}) => {
    const res = await axios.post(SAVING_TYPES_URL, payload, getHeader());
    return res.data;
};

export const useSavingTypePost = () => {
    return useMutation({mutationFn: payload => {
        return addSavingType(payload);
    }});
};
