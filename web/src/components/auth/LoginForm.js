import * as React from "react";
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { styled } from "styletron-react";
import { Button, KIND as ButtonKind, SIZE as ButtonSize, SHAPE } from "baseui/button";
import { Input, SIZE as InputSize } from "baseui/input";
import { FormControl } from "baseui/form-control";
import { StyledDivider, SIZE as DividerSize } from "baseui/divider";
import { StyledLink } from "baseui/link";
import { toaster } from "baseui/toast";

import { useLogin } from '../../hooks/auth/useLogin';

const LoginFormContainerUI = styled('div', {
    width: '20%',
    justifySelf: 'center',
});

const SignInButtonContainer = styled('div', {
    justifyContent: 'center',
    display: 'flex',
    marginBottom: '20px',
});

const SignUpLinkContainer = styled('div', {
    justifyContent: 'flex-end',
    display: 'flex',
    marginBottom: '20px',
    fontSize: '14px',
    cursor: 'pointer'
});

const LoginHeadingUI = styled('div', {
    marginBottom: '20px'
});

const signinButtonOverrides = {
    overrides: {
        BaseButton: {
            style: {
                width: '100%',
            }
        }
    }
};

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <FormControl label={label} error={touched && error && error}>
    <Input
      {...input}
      type={type}
      size={InputSize.compact}
      placeholder={type === 'password' ? 'Password' : 'Enter Name...'}
    />
  </FormControl>
);

const LoginFormComponent = ({ handleSubmit, setToken, setIsModalOpen }) => {
    const { mutateAsync: loginRequest, isLoading } = useLogin();

    const onSubmit = async (values) => {
    try {
      const resp = await loginRequest({
        "username": values.username,
        "password": values.password
      });
      setToken(resp);
    } catch (error) {
      toaster.negative("Login failed. Check your credentials and try again.", { autoHideDuration: 3000 })
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoginFormContainerUI>
        <LoginHeadingUI>Log in</LoginHeadingUI>
        <Field
          name="username"
          type="text"
          component={renderField}
          label="Username"
        />
        <Field
          name="password"
          type="password"
          component={renderField}
          label="Password"
        />
        <SignInButtonContainer>
          <Button
            kind={ButtonKind.primary}
            type='submit'
            shape={SHAPE.pill}
            size={ButtonSize.compact}
            {...signinButtonOverrides}
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </SignInButtonContainer>

        <StyledDivider $size={DividerSize.cell} />

        <SignUpLinkContainer>
          <StyledLink
            onClick={() => setIsModalOpen(true)}
            animateUnderline
          >
            Create an account
          </StyledLink>
        </SignUpLinkContainer>
      </LoginFormContainerUI>
    </form>
  );
};

const validate = (values) => {
  const errors = {};
  
  if (!values.username) {
    errors.username = 'Required';
  }
  
  if (!values.password) {
    errors.password = 'Required';
  }
  
  return errors;
};

export default reduxForm({
  form: 'login',
  validate
})(LoginFormComponent);

LoginFormComponent.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  loginRequest: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired
};
