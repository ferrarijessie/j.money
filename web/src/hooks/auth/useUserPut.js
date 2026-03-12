import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { getHeader, USER_URL } from '../endpoints';


export const updateUser = async (payload = {}) => {
    const res = await axios.put(USER_URL, payload, getHeader());
    return res.data;
};

export const useUserPut = () => {
    return useMutation({mutationFn: payload => {
        return updateUser(payload);
    }});
};