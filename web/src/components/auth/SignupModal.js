import * as React from "react";
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  SIZE,
  ROLE
} from "baseui/modal";

import SignupModalForm from './SignupModalForm';

const SignupModal = ({
    isOpen,
    onClose,
    setToken,
}) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        animate={true}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Create Account</ModalHeader>
        <SignupModalForm 
          setToken={setToken}
          setIsModalOpen={onClose}
        />
      </Modal>
    );
};

SignupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired
};

export default SignupModal;
