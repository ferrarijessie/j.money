import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVING_TYPES_URL } from '../endpoints';


export const updateSavingType = async ({id, payload = {}}) => {
    const res = await axios.put(`${SAVING_TYPES_URL}/${id}`, payload, getHeader());
    return res.data;
};

export const useSavingTypePut = () => {
    return useMutation({mutationFn: ({id, payload}) => {
        return updateSavingType({id, payload});
    }});
};
