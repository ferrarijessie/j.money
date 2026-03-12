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
import { change, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { toaster, ToasterContainer } from "baseui/toast";

import { renderField, renderCheckboxField } from "../formComponents";
import { gridOverrides, toasterOverrides, checkboxItemOverrides } from '../styles/globalStyles';

import { useIncomeTypePost } from "../../../hooks/incomeTypes/useIncomeTypePost";
import { useIncomeTypePut } from "../../../hooks/incomeTypes/useIncomeTypePut";


let IncomeTypeModal = ({
    isOpen,
    onClose,
    reload,
    incomeType = null,
    handleSubmit,
    formErrors,
    dispatch
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [recurrent, setRecurrent] = React.useState(!!incomeType ? incomeType["recurrent"] : false);

    const { mutateAsync: addIncomeTypeRequest } = useIncomeTypePost();
    const { mutateAsync: editIncomeTypeRequest } = useIncomeTypePut();

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'name': values.name,
            'recurrent': values.recurrent,
            'baseValue': values.baseValue
        }

        try {
            if (!!incomeType) {
                await editIncomeTypeRequest({
                    id: incomeType["id"], 
                    payload: payload
                });
            }
            else {
                await addIncomeTypeRequest(payload);
            }
            toaster.positive("Income type saved successfully", { autoHideDuration: 3000 });
            await reload();
            setIsLoading(false);
            onClose();
        } catch (error) {
            toaster.negative(`${error}`, { autoHideDuration: 3000 });
            setIsLoading(false);
        }
    };

    const handleRecurrentChange = (value, input) => {
        input.onChange(value);
        setRecurrent(!recurrent);
    };

    React.useEffect(() => {
        if (!!incomeType) {
            dispatch(change('incomeTypeForm', 'name', incomeType["name"]));
            dispatch(change('incomeTypeForm', 'recurrent', incomeType["recurrent"]));
            dispatch(change('incomeTypeForm', 'baseValue', incomeType["baseValue"]));
            setRecurrent(incomeType["recurrent"]);
        }
    }, [incomeType, dispatch]);

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
            <ModalHeader>{!!incomeType ? "Edit" : "Add"} Income Type</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>     
                    <FlexGrid {...gridOverrides}>
                        <FlexGridItem>
                            <Field 
                                name="name"
                                type="text"
                                component={renderField}
                                label="Income Type Name *"
                            />
                        </FlexGridItem>
                    </FlexGrid>
                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem {...checkboxItemOverrides}>
                            <Field 
                                name="recurrent"
                                component={renderCheckboxField}
                                label="Recurrent"
                                handleCheckboxChange={handleRecurrentChange}
                            />
                        </FlexGridItem>
                        {recurrent && 
                            <FlexGridItem>
                                <Field 
                                    name="baseValue"
                                    component={renderField}
                                    label="Base Value *"
                                />
                            </FlexGridItem>
                        }
                    </FlexGrid>
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
    
    if (values.recurrent && !values.baseValue) {
        errors.baseValue = 'Required';
    }
    
    return errors;
};

IncomeTypeModal = reduxForm({
    form: 'incomeTypeForm',
    enableReinitialize: true,
    touchOnBlur: false,
    validate
})(IncomeTypeModal);

export default connect()(IncomeTypeModal);
