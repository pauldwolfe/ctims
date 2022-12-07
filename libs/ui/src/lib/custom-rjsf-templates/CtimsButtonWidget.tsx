import {WidgetProps} from "@rjsf/utils";

const CtimsButtonWidget = (props: WidgetProps) => {
  const {
    id,
    label,
    disabled,
    readonly,
    onChange,
    uiSchema,
  } = props;

  const btnClick = uiSchema!['onClick'];

  const buttonClick = (e: any) => {
    e.preventDefault();
    console.log('buttonClick', props);
  }

  return (
    <button
      id={id}
      disabled={disabled || readonly}
      // onClick={() => onChange('clicked')}
      onClick={(e) => btnClick(e)}
    >
      {label || 'Submit'}
    </button>
  );
}
export default CtimsButtonWidget;
