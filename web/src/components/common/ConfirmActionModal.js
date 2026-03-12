import * as React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE
} from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import { ParagraphMedium } from "baseui/typography";


const ConfirmActionModal = ({
    isOpen,
    onClose,
    onConfirmClick,
    title,
    content,
    isLoading = false
}) => {
    
    return (
        <Modal
        onClose={onClose}
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        >
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <ParagraphMedium>{content}</ParagraphMedium>
            </ModalBody>
            <ModalFooter>
                <ModalButton kind={ButtonKind.tertiary} onClick={onClose}>
                    Cancel
                </ModalButton>
                <ModalButton onClick={() => onConfirmClick()} isLoading={isLoading}>
                    Confirm
                </ModalButton>
            </ModalFooter>
        </Modal>
    );
}

export default ConfirmActionModal;
