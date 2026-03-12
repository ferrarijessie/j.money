import React from "react";

import { useNavigate } from 'react-router-dom';

import { DarkTheme, ThemeProvider } from "baseui";
import { AppNavBar } from "baseui/app-nav-bar";

import UserItems from "../common/UserItems";


const AppNavigation = ({
    mainItems=[],
    onMainItemSelect=null
}) => {
    const navigate = useNavigate();

    const user = JSON.parse(sessionStorage.getItem('user'));

    const userItemAction = (item) => {
        if (item.url === '/logout') {
            sessionStorage.setItem('token', null);
            window.location.reload();
        } else {
            navigate(item.url);
        }
    }
    
    return (
        <ThemeProvider theme={DarkTheme}>
            <AppNavBar
                title="j.Money"
                username={user['name'] !== "" ? user['name'] : user['username']}
                usernameSubtitle={`#${user['id']}`}
                userItems={UserItems()}
                onUserItemSelect={item => userItemAction(item)}
                mainItems={mainItems}
                onMainItemSelect={onMainItemSelect}
            />
        </ThemeProvider>
        
    );
};

export default AppNavigation;