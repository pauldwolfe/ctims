import {WidgetProps} from "@rjsf/utils";
import React, {useEffect, useState} from "react";
import cn from "clsx";
import {InputText} from "primereact/inputtext";

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: "column",
  // marginTop: '20px',
  // marginBottom: '30px'
}

const containerHiddenStyle: React.CSSProperties = {
  display: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
  fontSize: "14px",
  marginBottom: '7px',
  marginTop: '7px',

}

const CtimsInput = (props: WidgetProps) => {
    const {
        id,
        placeholder,
        required,
        readonly,
        disabled,
        type,
        label,
        value,
        onChange,
        onBlur,
        onFocus,
        autofocus,
        options,
        schema,
        uiSchema,
        rawErrors = [],
    } = props;

    const [isHidden, setIsHidden] = useState(false);

  const uiOptions = uiSchema?.['ui:options']


  useEffect(() => {
    if (uiOptions) {
      if (uiOptions['dialog']) {
        console.log('uiOptions dialog', uiOptions['dialog'])
        setIsHidden(true)
      }
    }
  }, [])

    const _onChange = ({
                           target: { value },
                       }: React.ChangeEvent<HTMLInputElement>) =>
        onChange(value === "" ? options.emptyValue : value);
    const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
        onBlur(id, value);
    const _onFocus = ({
                          target: { value },
                      }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);
    const inputType = (type || schema.type) === "string" ? "text" : `${type || schema.type}`
    const labelValue = uiSchema?.["ui:title"] || schema.title || label;



    return (
        <div style={isHidden ? containerHiddenStyle : containerStyle}>
            {labelValue && (
                <span style={labelStyle}>{labelValue}</span>
            )}
            <InputText
                id={id}
                placeholder={placeholder}
                autoFocus={autofocus}
                required={required}
                disabled={disabled}
                readOnly={readonly}
                className={cn("w-full", rawErrors.length > 0 ? "p-invalid" : "")}
                list={schema.examples ? `examples_${id}` : undefined}
                type={inputType}
                value={value || value === 0 ? value : ""}
                onChange={_onChange}
                onBlur={_onBlur}
                onFocus={_onFocus}
            />
        </div>
    );
}
export default CtimsInput;
