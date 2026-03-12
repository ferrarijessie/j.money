import { styled } from 'styletron-react';

export const ContentWrapper = styled('div', {
    minHeight: '100vh',
    paddingBottom: '60px',
});

export const gridOverrides = {
    marginTop: '15px'
};

export const toasterOverrides = {
    ToastBody: {
        style: {
            width: '500px'
        }
    }
};

export const checkboxItemOverrides = {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    paddingTop: '17px',
};
