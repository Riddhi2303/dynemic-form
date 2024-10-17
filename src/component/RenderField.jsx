import { Controller } from "react-hook-form";

const RenderField = ({
  field,
  register,
  control,
  errors,
}) => {
  const error = errors[field.name];

  const renderLabel = () => (
    <label className="block text-sm font-medium text-gray-700">
      {field.label}
      {field.required && <span className="text-red-500">*</span>}
    </label>
  );

  const renderError = () => error && <p className="text-red-500 text-sm">{error.message}</p>;

  const renderInput = () => {
    const commonProps = {
      ...register(field.name, {
        valueAsNumber: field.type === "number",
        required: field.required ? `${field.label} is required` : false,
      }),
      className: `mt-1 block w-full border p-2 rounded-md ${error ? "border-red-500" : "border-gray-300"}`,
      placeholder: field.placeholder,
    };

    return field.type === "textarea" ? (
      <textarea {...commonProps} />
    ) : (
      <input type={field.type} {...commonProps} />
    );
  };

  const renderDropdown = () => (
    <select
      {...register(field.name)}
      className={`mt-1 block w-full border p-2 rounded-md ${error ? "border-red-500" : "border-gray-300"}`}
    >
      <option value="">Select an option</option>
      {field.options?.map((option, idx) => (
        <option key={idx} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  const renderRadioButtons = () => (
    field.options?.map((option, idx) => (
      <div key={idx} className="flex items-center">
        <input
          {...register(field.name, {
            required: field.required ? `${field.label} is required` : false,
          })}
          type="radio"
          value={option.value}
          className="mr-2"
        />
        <label>{option.label}</label>
      </div>
    ))
  );

  const renderCheckboxes = () => (
    <Controller
      name={field.name}
      control={control}
      defaultValue={[]}
      render={({ field: controllerField }) => (
        <>
          {field.options.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                value={option.value}
                checked={Array.isArray(controllerField.value) && controllerField.value.includes(option.value)}
                onChange={(e) => {
                  const value = e.target.value;
                  const currentValue = Array.isArray(controllerField.value) ? controllerField.value : [];

                  controllerField.onChange(
                    e.target.checked ? [...currentValue, value] : currentValue.filter(v => v !== value)
                  );
                }}
                className="mr-2"
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </>
      )}
    />
  );

  const renderSlider = () => (
    <Controller
      name={field.name}
      control={control}
      defaultValue={field.min}
      render={({ field: controllerField }) => (
        <>
          <input
            type="range"
            min={field.min}
            max={field.max}
            step={field.step}
            {...controllerField}
            className="mt-1 block w-full"
            onChange={(e) => controllerField.onChange(parseFloat(e.target.value))}
            aria-label={`${field.label} slider`}
          />
          <div className="mt-2 text-center text-sm text-gray-600">
            Current Value: {controllerField.value}
          </div>
        </>
      )}
    />
  );

  const renderFieldByType = () => {
    switch (field.type) {
      case "text":
      case "textarea":
      case "number":
        return renderInput();
      case "dropdown":
        return renderDropdown();
      case "radio":
        return renderRadioButtons();
      case "checkbox":
        return renderCheckboxes();
      case "slider":
        return renderSlider();
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      {renderLabel()}
      {renderFieldByType()}
      {renderError()}
    </div>
  );
};

export default RenderField;
