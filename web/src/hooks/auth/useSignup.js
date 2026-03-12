import { useMutation } from '@tanstack/react-query';
import axios from "axios";

import { SIGNUP_URL } from '../endpoints';


export const signup = async (payload = {}) => {
    const res = await axios.post(SIGNUP_URL, payload);
    return res.data;
};

export const useSignup = () => {
    return useMutation({mutationFn: payload => {
        return signup(payload);
    }});
};