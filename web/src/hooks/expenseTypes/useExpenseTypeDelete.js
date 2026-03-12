import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, EXPENSE_TYPES_URL } from '../endpoints';


export const deleteExpenseType = async (id) => {
    const res = await axios.delete(`${EXPENSE_TYPES_URL}/${id}`, getHeader());
    return res.data;
};

export const useExpenseTypeDelete = () => {
    return useMutation({mutationFn: id => {
        return deleteExpenseType(id);
    }});
};
