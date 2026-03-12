import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, EXPENSES_URL } from '../endpoints';


export const addExpense = async (payload = {}) => {
    const res = await axios.post(`${EXPENSES_URL}/`, payload, getHeader());
    return res.data;
};

export const useExpensePost = () => {
    return useMutation({mutationFn: payload => {
        return addExpense(payload);
    }});
};
