import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"; // Use Yup resolver
import { createSchema } from "./FormSchema"; // Import your Yup schema generator
import RenderField from "./RenderField"; // Import field rendering logic

const DynamicForm = ({ formSchema }) => {
  const schema = createSchema(formSchema); // Use Yup schema generated from formSchema
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Use Yup resolver
  });

  const [defaultValues, setDefaultValues] = useState({});

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setDefaultValues(parsedData);
      reset(parsedData); // Populate the form with saved data
    }
  }, [reset]);

  const onSubmit = (data) => {
    localStorage.setItem("formData", JSON.stringify(data)); // Save form data to localStorage
    alert("Form submitted successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto mt-8 p-4 border rounded-md"
    >
      <h1 className="text-xl font-bold">{formSchema.form.title}</h1>
      <p className="text-gray-600">{formSchema.form.description}</p>

      {formSchema.form.groups.map((group, idx) => (
        <div key={idx} className="mb-6">
          <h2 className="text-lg font-semibold mb-4">{group.title}</h2>
          {group.fields.map((field) => (
            <RenderField
              key={field.name} // Unique key for each field
              field={field}
              register={register}
              control={control}
              errors={errors}
              getValues={getValues}
              setValue={setValue}
            />
          ))}
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
