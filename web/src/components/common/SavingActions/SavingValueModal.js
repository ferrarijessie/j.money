import * as React from "react";
import moment from "moment";
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
import { toaster, ToasterContainer } from "baseui/toast";
import { reduxForm, Field, change } from "redux-form";
import { connect } from "react-redux";

import { renderField, renderSelectField } from '../formComponents';
import { gridOverrides, toasterOverrides } from '../styles/globalStyles';

import { useSavingPost } from "../../../hooks/savings/useSavingPost";
import { useSavingPut } from "../../../hooks/savings/useSavingPut";

let SavingValueModal = ({
    isOpen,
    onClose,
    reload,
    savingTypes = [],
    savingTypeInitial = null,
    saving = null,
    dispatch,
    handleSubmit,
    selectedMonth,
    selectedYear
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);

    const { mutateAsync: addSavingRequest } = useSavingPost();
    const { mutateAsync: editSavingResquest } = useSavingPut();

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'year': values.year,
            'month': values.month[0].id,
            'typeId': values.savingType[0].id,
            'value': values.value
        };

        try {
            if (!!saving) {
                await editSavingResquest({
                    id: saving["id"], 
                    payload: payload
                });
            }
            else {
                await addSavingRequest(payload);
            }
            await reload();
            setIsLoading(false);
            toaster.positive("Saving saved successfully", { autoHideDuration: 3000 });
            onClose();
        } catch (error) {
            toaster.negative(`${error}`, { autoHideDuration: 3000 });
            setIsLoading(false);
        }
    };

    const options = savingTypes?.map(sType => ({
        label: sType['name'],
        id: sType['id'],
        baseValue: sType['baseValue']
    }));

    const months = moment.months();
    const monthOptions = months.map((month, index) => ({
        label: month,
        id: index+1,
    }));

    const onChangeOption = (value, input) => {
        input.onChange(value);
        if (value[0].baseValue) {
            dispatch(change('savingValueForm', 'value', value[0].baseValue.toFixed(2)));
        }
    };

    React.useEffect(() => {
        if (!!savingTypeInitial) {
            dispatch(change('savingValueForm', 'savingType', [options.find(option => option.id === savingTypeInitial.id)]));
            dispatch(change('savingValueForm', 'value', savingTypeInitial.baseValue?.toFixed(2)));
            dispatch(change('savingValueForm', 'month', [monthOptions.find(month => month.id === parseInt(moment().format('MM')))]));
            dispatch(change('savingValueForm', 'year', moment().format('YYYY')));
        }
        else if (!!saving) {
            dispatch(change('savingValueForm', 'savingType', [options.find(option => option.id === saving['typeId'])]));
            dispatch(change('savingValueForm', 'value', saving['value'].toFixed(2)));
            dispatch(change('savingValueForm', 'month', [monthOptions.find(month => month.id === parseInt(saving['month']))]));
            dispatch(change('savingValueForm', 'year', parseInt(saving['year'])));
        }
        else {
            const monthVal = !!selectedMonth ? parseInt(selectedMonth) : parseInt(moment().format('MM'));
            dispatch(change('savingValueForm', 'month', [monthOptions.find(month => month.id === monthVal)]));
            dispatch(change('savingValueForm', 'year', !!selectedYear ? selectedYear : moment().format('YYYY')));
        }
    }, [saving, savingTypeInitial, options, monthOptions, dispatch, selectedMonth, selectedYear]);

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
            <ModalHeader>{saving ? 'Edit' : 'Add'} Saving</ModalHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field
                                name="savingType"
                                type="select"
                                options={options}
                                component={renderSelectField}
                                label="Saving Type"
                                placeholder="Select a saving type"
                                disabled={!!saving || !!savingTypeInitial}
                                handleOptionChange={onChangeOption}
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="value"
                                type="number"
                                component={renderField}
                                label="Value"
                                placeholder="Value..."
                            />
                        </FlexGridItem>
                    </FlexGrid>

                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field
                                name="month"
                                type="select"
                                options={monthOptions}
                                component={renderSelectField}
                                label="Month"
                                placeholder="Select a month"
                                handleOptionChange={onChangeOption}
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="year"
                                type="number"
                                component={renderField}
                                label="Year"
                                placeholder="Year..."
                            />
                        </FlexGridItem>
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

    if (!values.savingType) {
        errors.savingType = 'Saving type is required';
    }

    if (!values.value) {
        errors.value = 'Value is required';
    }
    
    if (!values.month) {
        errors.month = 'Month is required';
    }
    
    if (!values.year) {
        errors.year = 'Year is required';
    }
    
    return errors;
};

SavingValueModal = reduxForm({
    form: 'savingValueForm',
    validate
})(SavingValueModal);

export default connect()(SavingValueModal);

