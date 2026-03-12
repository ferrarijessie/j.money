import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, INCOMES_URL } from '../endpoints';


export const updateIncome = async ({id, payload = {}}) => {
    const res = await axios.put(`${INCOMES_URL}/${id}`, payload, getHeader());
    return res.data;
};

export const useIncomePut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateIncome({id, payload});
    }});
};
