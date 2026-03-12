import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVINGS_URL } from '../endpoints';


export const updateSaving = async ({id, payload = {}}) => {
    const res = await axios.put(`${SAVINGS_URL}/${id}`, payload, getHeader());
    return res.data;
};

export const useSavingPut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateSaving({id, payload});
    }});
};
