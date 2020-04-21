import * as React from 'react';
import { onSpaceOrEnter } from '../_helpers/utils';
import { ParsableDate } from '../constants/prop-types';
import { MaterialUiPickersDate } from '../typings/date';
import { TextFieldProps } from '@material-ui/core/TextField';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { useUtils, MuiPickersAdapter } from './hooks/useUtils';
import { InputAdornmentProps } from '@material-ui/core/InputAdornment';
import { getDisplayDate, getTextFieldAriaText } from '../_helpers/text-field-helper';

type MuiTextFieldProps = TextFieldProps | Omit<TextFieldProps, 'variant'>;

export interface DateInputProps<TInputValue = ParsableDate, TDateValue = MaterialUiPickersDate> {
  open: boolean;
  rawValue: TInputValue;
  parsedDateValue: TDateValue;
  inputFormat: string;
  onChange: (date: TDateValue, keyboardInputValue?: string) => void;
  openPicker: () => void;
  readOnly?: boolean;
  disabled?: boolean;
  validationError?: React.ReactNode;
  label?: TextFieldProps['label'];
  InputProps?: TextFieldProps['InputProps'];
  TextFieldProps?: Partial<MuiTextFieldProps>;
  // ?? TODO when it will be possible to display "empty" date in datepicker use it instead of ignoring invalid inputs
  ignoreInvalidInputs?: boolean;
  /** Override input component */
  renderInput: (props: MuiTextFieldProps) => React.ReactElement;
  /**
   * Message displaying in read-only text field when null passed
   * @default ' '
   */
  emptyInputText?: string;
  /** Icon displaying for open picker button */
  keyboardIcon?: React.ReactNode;
  /**
   * Custom mask. Can be used to override generate from format. (e.g. __/__/____ __:__ or __/__/____ __:__ _M)
   */
  mask?: string;
  /**
   *Regular expression to detect "accepted" symbols
   * @default /\dap/gi
   */
  acceptRegex?: RegExp;
  /**
   * Props to pass to keyboard input adornment
   * @type {Partial<InputAdornmentProps>}
   */
  InputAdornmentProps?: Partial<InputAdornmentProps>;
  /**
   * Props to pass to keyboard adornment button
   * @type {Partial<IconButtonProps>}
   */
  KeyboardButtonProps?: Partial<IconButtonProps>;
  /** Custom formatter to be passed into Rifm component */
  rifmFormatter?: (str: string) => string;
  /**
   * Do not render open picker button (renders only text field with validation)
   * @default false
   */
  disableOpenPicker?: boolean;
  /**
   * Disable mask on the keyboard, this should be used rarely. Consider passing proper mask for your format
   * @default false
   */
  disableMaskedInput?: boolean;
  /**
   * Get aria-label text for control that opens picker dialog. Aria-label text must include selected date.
   * @default (value, utils) => `Choose date, selected date is ${utils.format(utils.date(value), 'fullDate')}`
   */
  getOpenDialogAriaText?: (value: ParsableDate, utils: MuiPickersAdapter) => string;
}

export type ExportedDateInputProps<TInputValue, TDateValue> = Omit<
  DateInputProps<TInputValue, TDateValue>,
  | 'openPicker'
  | 'inputValue'
  | 'onChange'
  | 'inputFormat'
  | 'validationError'
  | 'rawValue'
  | 'forwardedRef'
  | 'parsedDateValue'
  | 'open'
  | 'TextFieldProps'
>;

export interface DateInputRefs {
  containerRef?: React.Ref<HTMLDivElement>;
  forwardedRef?: React.Ref<HTMLInputElement>;
}

export const PureDateInput: React.FC<DateInputProps & DateInputRefs> = ({
  inputFormat,
  rawValue,
  validationError,
  InputProps,
  openPicker: onOpen,
  renderInput,
  emptyInputText: emptyLabel,
  forwardedRef,
  containerRef,
  getOpenDialogAriaText = getTextFieldAriaText,
  disabled,
  label,
  TextFieldProps = {},
}) => {
  const utils = useUtils();
  const PureDateInputProps = React.useMemo(
    () => ({
      ...InputProps,
      readOnly: true,
    }),
    [InputProps]
  );

  const inputValue = getDisplayDate(rawValue, utils, {
    inputFormat,
    emptyInputText: emptyLabel,
  });

  return renderInput({
    label,
    disabled,
    ref: containerRef,
    inputRef: forwardedRef,
    error: Boolean(validationError),
    helperText: validationError,
    'aria-label': getOpenDialogAriaText(rawValue, utils),
    onClick: onOpen,
    value: inputValue,
    InputProps: PureDateInputProps,
    onKeyDown: onSpaceOrEnter(onOpen),
    ...TextFieldProps,
  });
};

PureDateInput.displayName = 'PureDateInput';
