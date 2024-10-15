import * as yup from "yup";

export const createSchema = (formConfig) => {
  const shape = {}; 

  formConfig.form.groups.forEach((group) => {
    group.fields.forEach((field) => {
      switch (field.type) {
        case "text":
        case "textarea":
          shape[field.name] = field.required
            ? yup.string().required(`${field.label} is required`)
            : yup.string().nullable();
          break;
        case "number":
          shape[field.name] = field.required
            ? yup
                .number()
                .typeError(`${field.label} must be a number`)
                .min(
                  field.min ?? -Infinity,
                  `${field.label} must be at least ${field.min}`
                )
                .max(
                  field.max ?? Infinity,
                  `${field.label} must be at most ${field.max}`
                )
                .required(`${field.label} is required`)
            : yup
                .number()
                .nullable()
                .transform((v, originalValue) =>
                  originalValue.trim() === "" ? null : v
                );
          break;
          case "slider":
            shape[field.name] = yup
              .number()
              .typeError(`${field.label} must be a number`) // Ensure it's treated as a number
              .min(field.min, `${field.label} must be at least ${field.min}`)
              .max(field.max, `${field.label} must be at most ${field.max}`)
              .required(field.required ? `${field.label} is required` : undefined); // Ensure required works correctly
            break;

        case "checkbox":
          shape[field.name] = yup
            .array()
            .of(yup.string())
            .min(1, `${field.label} must have at least one selection`)
            .required(`${field.label} is required`);
          break;

        case "radio":
          shape[field.name] = field.required
            ? yup.string().required(`${field.label} is required`)
            : yup.string().nullable();
          break;

        case "dropdown":
          shape[field.name] = field.required
            ? yup.string().required(`${field.label} is required`)
            : yup.string().nullable();
          break;

        default:
          shape[field.name] = yup.string().nullable();
      }
    });
  });

  return yup.object().shape(shape); // Return Yup schema object
};
