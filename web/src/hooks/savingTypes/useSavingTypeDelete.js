import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, SAVING_TYPES_URL } from '../endpoints';


export const deleteSavingType = async (id) => {
    const res = await axios.delete(`${SAVING_TYPES_URL}/${id}`, getHeader());
    return res.data;
};

export const useSavingTypeDelete = () => {
    return useMutation({mutationFn: id => {
        return deleteSavingType(id);
    }});
};
