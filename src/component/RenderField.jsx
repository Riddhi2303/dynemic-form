import { Controller } from "react-hook-form";

const RenderField = ({
  field,
  register,
  control,
  errors,
}) => {
  const error = errors[field.name];

  switch (field.type) {
    case "text":
    case "textarea":
    case "number":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              {...register(field.name)}
              placeholder={field.placeholder}
              className={`mt-1 block w-full border p-2 rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
          ) : (
            <input
              {...register(field.name, {
                valueAsNumber: field.type === "number",
                required: field.required ? `${field.label} is required` : false,
              })}
              type={field.type}
              placeholder={field.placeholder}
              className={`mt-1 block w-full border p-2 rounded-md ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
          )}
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      );

    case "dropdown":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            {...register(field.name)}
            className={`mt-1 block w-full border p-2 rounded-md ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      );

    case "radio":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.options?.map((option, idx) => (
            <div key={idx} className="flex items-center">
              <input
                {...register(field.name, {
                  required: field.required
                    ? `${field.label} is required`
                    : false,
                })}
                type="radio"
                value={option.value}
                className="mr-2"
              />
              <label>{option.label}</label>
            </div>
          ))}
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      );
      case "checkbox":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <Controller
              name={field.name}
              control={control}
              defaultValue={[]} 
              render={({ field: controllerField }) => (
                <>
                  {field.options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={Array.isArray(controllerField.value) && controllerField.value.includes(option.value)} // Ensure value is an array before using includes
                        onChange={(e) => {
                          const value = e.target.value;
                          const currentValue = Array.isArray(controllerField.value) ? controllerField.value : [];
      
                          if (e.target.checked) {
                            // Add the value to the array if checked
                            controllerField.onChange([...currentValue, value]);
                          } else {
                            // Remove the value from the array if unchecked
                            controllerField.onChange(currentValue.filter((v) => v !== value));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))}
                </>
              )}
            />
            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>
        );
      
    case "slider":
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
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
                  onChange={(e) => {
                    const value = parseFloat(e.target.value); // Use parseFloat for decimal values
                    controllerField.onChange(value);
                  }}
                  aria-label={`${field.label} slider`}
                />
                <div className="mt-2 text-center text-sm text-gray-600">
                  Current Value: {controllerField.value}
                </div>
              </>
            )}
          />
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      );

    default:
      return null;
  }
};

export default RenderField;
