import { FormControl } from "baseui/form-control";
import { Input, SIZE as InputSize } from "baseui/input";
import { Select } from "baseui/select";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { Datepicker } from "baseui/datepicker";

export const renderField = ({ input, label, type, meta: { touched, error } }) => (
    <FormControl label={label} error={touched && error && error}>
      <Input
        {...input}
        type={type}
        size={InputSize.compact}
      />
    </FormControl>
  );
  
export const renderSelectField = ({ input, label, options, placeholder, disabled, handleOptionChange, meta: { touched, error } }) => (
  <FormControl label={label} error={touched && error && error}>
      <Select
          options={options}
          value={input.value}
          size={InputSize.compact}
          onChange={({ value }) => handleOptionChange(value, input)}
          placeholder={!input.value ? placeholder : null}
          labelKey="label"
          valueKey="id"
          disabled={disabled}
      />
  </FormControl>
);

export const renderCheckboxField = ({ input, label, handleCheckboxChange, meta: { touched, error } }) => (
    <Checkbox
        checked={input.value}
        onChange={(value) => handleCheckboxChange(value, input)}
        size={InputSize.compact}
        labelPlacement={LABEL_PLACEMENT.left}
    >
        {label}
    </Checkbox>
);

export const renderDateField = ({ input, label, type, meta: { touched, error } }) => (
    <FormControl label={label} error={touched && error && error}>
        <Datepicker
            type={type}
            size={InputSize.compact}
            formatDisplay="DD/MM/YYYY"
            value={input.value}
            onChange={({ date }) =>
                input.onChange(Array.isArray(date) ? date : [date])
            }
            clearable
        />
    </FormControl>
);

