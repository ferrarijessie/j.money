import React from 'react';

export const setToken = (user) => {
    sessionStorage.setItem('token', JSON.stringify(user['token']));
    sessionStorage.setItem('user', JSON.stringify(user));
    window.location.reload();
  };
  
export const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken
};
