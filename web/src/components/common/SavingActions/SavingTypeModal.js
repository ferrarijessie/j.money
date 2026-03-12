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
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Field, change, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { toaster, ToasterContainer } from "baseui/toast";

import { renderField, renderCheckboxField } from "../formComponents";
import { gridOverrides, toasterOverrides, checkboxItemOverrides } from '../styles/globalStyles';

import { useSavingTypePost } from "../../../hooks/savingTypes/useSavingTypePost";
import { useSavingTypePut } from "../../../hooks/savingTypes/useSavingTypePut";


let SavingTypeModal = ({
    isOpen,
    onClose,
    reload,
    savingType = null,
    dispatch,
    handleSubmit,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const { mutateAsync: addSavingTypeRequest } = useSavingTypePost();
    const { mutateAsync: editSavingTypeRequest } = useSavingTypePut();

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'name': values.name,
            'active': values.active,
            'baseValue': values.baseValue
        }

        try {
            if (savingType !== null) {
                await editSavingTypeRequest({
                    id: savingType["id"], 
                    payload: payload
                });
            }
            else {
                await addSavingTypeRequest(payload);
            }
            await reload();
            setIsLoading(false);
            toaster.positive("Saving type saved successfully", { autoHideDuration: 3000 });
            onClose();
        } catch (error) {
            toaster.negative(`${error}`, { autoHideDuration: 3000 });
            setIsLoading(false);
        }
    };

    const handleActiveChange = (value, input) => {
        input.onChange(value);
    };

    React.useEffect(() => {
        if (savingType !== null) {
            dispatch(change('savingTypeForm', 'name', savingType["name"]));
            dispatch(change('savingTypeForm', 'active', savingType["active"]));
            dispatch(change('savingTypeForm', 'baseValue', savingType["baseValue"]));
        }
    }, [savingType, dispatch]);

    return (
        <>
        <ToasterContainer autoHideDuration={10000} overrides={toasterOverrides} />
        <Modal
        onClose={onClose}
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
        >
            <ModalHeader>{!!savingType ? "Edit" : "Add"} Saving Type</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field 
                                name="name"
                                type="text"
                                component={renderField}
                                label="Saving Type Name *"
                            />
                        </FlexGridItem>
                        <FlexGridItem {...checkboxItemOverrides}>
                            <Field 
                                name="active"
                                component={renderCheckboxField}
                                label="Active"
                                handleCheckboxChange={handleActiveChange}
                            />
                        </FlexGridItem>
                    </FlexGrid>
                    <Field 
                        name="baseValue"
                        component={renderField}
                        label="Base Value *"
                    />
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind={ButtonKind.tertiary} onClick={onClose} type={'button'}>
                        Cancel
                    </ModalButton>
                    <ModalButton type={'submit'} isLoading={isLoading}>
                        Save
                    </ModalButton>
                </ModalFooter>
            </form>
        </Modal>
        </>
    );
}

const validate = (values) => {
    const errors = {};
    
    if (!values.name) {
        errors.name = 'Required';
    }
    
    return errors;
};

SavingTypeModal = reduxForm({
    form: 'savingTypeForm',
    enableReinitialize: true,
    touchOnBlur: false,
    validate
})(SavingTypeModal);

export default connect()(SavingTypeModal);
