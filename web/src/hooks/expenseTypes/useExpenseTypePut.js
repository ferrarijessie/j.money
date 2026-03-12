import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, EXPENSE_TYPES_URL } from '../endpoints';


export const updateExpenseType = async ({id, payload = {}}) => {
    const res = await axios.put(`${EXPENSE_TYPES_URL}/${id}`, payload, getHeader());
    return res.data;
};

export const useExpenseTypePut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateExpenseType({id, payload});
    }});
};
