import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";

import { setToken, getToken } from './utils';
import AppRoutes from '../AppRoutes';
import Login from './auth/Login';
import { ContentWrapper } from './common/styles/globalStyles';
import store from '../store';
import { Provider } from 'react-redux';


const queryClient = new QueryClient();
const engine = new Styletron();


function App() {
  const token = getToken();

  if(!token) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <StyletronProvider value={engine}>
            <ContentWrapper>
              <Login setToken={setToken} />
            </ContentWrapper>
          </StyletronProvider>
        </QueryClientProvider>
      </Provider>
      )
  }

  return (
    <>     
    <Provider store={store}> 
      <QueryClientProvider client={queryClient}>
        <StyletronProvider value={engine}>
          <ContentWrapper>
            <BaseProvider theme={LightTheme}>
              <AppRoutes />
            </BaseProvider>
          </ContentWrapper> 
        </StyletronProvider>
      </QueryClientProvider>
    </Provider>
    </>
    
  );
}

export default App;
