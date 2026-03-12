import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { LOGIN_URL } from '../endpoints';


export const loginUser = async (payload = {}) => {
    const res = await axios.post(LOGIN_URL, payload);
    return res.data;
};

export const useLogin = () => {
    return useMutation({mutationFn: payload => {
        return loginUser(payload);
    }});
};