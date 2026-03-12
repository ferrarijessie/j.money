import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, INCOME_TYPES_URL } from '../endpoints';


export const addIncomeType = async (payload = {}) => {
    const res = await axios.post(INCOME_TYPES_URL, payload, getHeader());
    return res.data;
};

export const useIncomeTypePost = () => {
    return useMutation({mutationFn: payload => {
        return addIncomeType(payload);
    }});
};
