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
import { change, reset, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import { renderField, renderSelectField } from '../formComponents';
import { gridOverrides, toasterOverrides } from '../styles/globalStyles';

import { useExpensePost } from "../../../hooks/expenses/useExpensePost"; 
import { useExpensePut } from "../../../hooks/expenses/useExpensePut";


let ExpenseModal = ({
    isOpen,
    onClose,
    reload,
    expenseTypes = [],
    expenseTypeInitial = null,
    expense = null,
    dispatch,
    handleSubmit,
    selectedMonth,
    selectedYear
}) => {
    
    const [isLoading, setIsLoading] = React.useState(false);

    const { mutateAsync: addExpenseRequest } = useExpensePost();
    const { mutateAsync: editExpenseRequest } = useExpensePut();

    const onChangeOption = (value, input) => {
        input.onChange(value);
        if (value[0].baseValue) {
            dispatch(change('expenseForm', 'value', value[0].baseValue.toFixed(2)));
        }
    }; 

    const onSubmit = async (values) => {
        setIsLoading(true);

        const payload = {
            'year': values.year,
            'month': values.month[0].id,
            'typeId': values.expenseType[0].id,
            'value': values.value
        };

        try {
            if (!!expense) {
                await editExpenseRequest({
                    id: expense['id'], 
                    payload: payload
                });
            } else {
                await addExpenseRequest(payload);
            }
            await reload();
            setIsLoading(false);
            dispatch(reset('expenseForm'));
            onClose();
        } catch (error) {
            toaster.negative(`${error}`, { autoHideDuration: 3000 });
            setIsLoading(false);
        }   
    };

    const options = expenseTypes?.map(eType => ({
        label: eType['name'],
        id: eType['id'],
        baseValue: eType['baseValue']
    }));

    const months = moment.months();
    const monthOptions = months.map((month, index) => ({
        label: month,
        id: index+1,
    }));
    
    React.useEffect(() => {
        if (!!expenseTypeInitial) {
            dispatch(change('expenseForm', 'expenseType', [options.find(e => e.id === expenseTypeInitial.id)]));
            dispatch(change('expenseForm', 'value', expenseTypeInitial.baseValue.toFixed(2)));
        }

        else if (!!expense) {
            dispatch(change('expenseForm', 'expenseType', [options.find(e => e.id === expense['typeId'])]));
            dispatch(change('expenseForm', 'value', expense['value'].toFixed(2)));
            dispatch(change('expenseForm', 'month', [monthOptions.find(m => m.id === expense['month'])]));
            dispatch(change('expenseForm', 'year', expense['year']));
        }
        else {
            const monthVal = !!selectedMonth ? parseInt(selectedMonth) : parseInt(moment().format('MM'));
            dispatch(change('expenseForm', 'month',  [monthOptions.find(m => m.id === monthVal)]));
            dispatch(change('expenseForm', 'year', !!selectedYear ? selectedYear : moment().format('YYYY')));
        }
    }, [dispatch, monthOptions, expenseTypeInitial, options, expense, selectedMonth, selectedYear]);

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
            <ModalHeader>Edit Expense</ModalHeader>
         
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field
                                name="expenseType"
                                type="select"
                                options={options}
                                component={renderSelectField}
                                label="Expense Type"
                                placeholder="Select an expense type"
                                disabled={!!expense || !!expenseTypeInitial}
                                handleOptionChange={onChangeOption}
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="value"
                                type="number"
                                component={renderField}
                                label="Value"
                            />
                        </FlexGridItem>
                    </FlexGrid>

                    <FlexGrid flexGridColumnCount={2} flexGridColumnGap={"5px"} {...gridOverrides}>
                        <FlexGridItem>
                            <Field
                                name="month"
                                type="number"
                                component={renderSelectField}
                                options={monthOptions}
                                label="Month"
                                placeholder="Select month"
                                disabled={false}
                                handleOptionChange={onChangeOption}
                            />
                        </FlexGridItem>
                        <FlexGridItem>
                            <Field
                                name="year"
                                type="number"
                                component={renderField}
                                label="Year"
                            />
                        </FlexGridItem>
                    </FlexGrid>
                </ModalBody>
                <ModalFooter>
                    <ModalButton 
                        kind={ButtonKind.tertiary} 
                        onClick={() => onClose()}
                        type={'button'}
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
        </Modal>
        </>
    );
}

const validate = (values) => {
    const errors = {};
    
    if (!values.expenseType) {
        errors.expenseType = 'Required';
    }
    
    if (!values.value) {
        errors.value = 'Required';
    }

    if (!values.month) {
        errors.month = 'Required';
    }

    if (!values.year) {
        errors.year = 'Required';
    }
    
    return errors;
};

ExpenseModal = reduxForm({
    form: 'expenseForm',
    enableReinitialize: true,
    validate
})(ExpenseModal);

export default connect()(ExpenseModal);
