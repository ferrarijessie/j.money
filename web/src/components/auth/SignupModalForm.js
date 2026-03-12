import * as React from "react";
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { FormControl } from "baseui/form-control";
import { Input, SIZE as InputSize } from "baseui/input";
import { ModalBody, ModalFooter, ModalButton } from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { toaster } from "baseui/toast";

import { useSignup } from '../../hooks/auth/useSignup';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <FormControl label={label} error={touched && error && error}>
    <Input
      {...input}
      type={type}
      size={InputSize.compact}
    />
  </FormControl>
);

const SignupModalForm = ({ handleSubmit, setToken, setIsModalOpen, isLoading }) => {
  const { mutateAsync: signupRequest } = useSignup();

  const onSubmit = async (values) => {
    try {
      const resp = await signupRequest({
        "username": values.username,
        "password": values.password
      });
      setToken(resp);
      window.location.reload();
    } catch (error) {
      toaster.negative("Signup failed. Username might already be taken.", { autoHideDuration: 3000 })
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalBody>
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
      </ModalBody>
      <ModalFooter>
        <ModalButton 
          kind={ButtonKind.tertiary} 
          onClick={setIsModalOpen}
        >
          Cancel
        </ModalButton>
        <ModalButton 
          type={'submit'} 
          isLoading={isLoading}
        >
          Save
        </ModalButton>
      </ModalFooter>
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
  form: 'signup',
  validate
})(SignupModalForm);

SignupModalForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};
