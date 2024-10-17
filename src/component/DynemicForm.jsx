import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSchema } from "./FormSchema"; // Import your Yup schema generator
import RenderField from "./RenderField";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const DynamicForm = ({ formSchema }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [formData, setFormData] = useState({});
  
  const schema = createSchema(formSchema);  
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
    trigger, // Used for validation of specific fields
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: formData,
  });

  // Save form data in local storage or state
  useEffect(() => {
    const savedData = localStorage.getItem("formData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleSectionClick = async (index) => {
    // Prevent skipping sections by validating all previous sections
    if (index > activeSectionIndex) {
      for (let i = 0; i < index; i++) {
        const sectionFields = formSchema.form.groups[i].fields.map(field => field.name);
        const isValid = await trigger(sectionFields); // Validate each section in sequence
  
        if (!isValid) {
          toast.error(`Please complete Section ${i + 1} before proceeding.`);
          return; // Stop navigation if any section is invalid
        }
      }
    }
  
    setActiveSectionIndex(index); // Navigate to the intended section if valid
  };
  

  // Handle validation and navigation to the next section
  const handleNextSection = async () => {
    const currentSectionFields = formSchema.form.groups[activeSectionIndex].fields.map(field => field.name);
    
    const isValid = await trigger(currentSectionFields); // Validate current section only
    if (isValid) {
      setActiveSectionIndex((prevIndex) => prevIndex + 1); // Move to the next section if valid
    }
  };

  const handlePreviousSection = () => {
    setActiveSectionIndex((prevIndex) => prevIndex - 1); // Go back to the previous section
  };

  const onSubmit = (data) => {
    localStorage.setItem("formData", JSON.stringify(data)); // Save form data to local storage
    toast.success("Form submitted successfully!");
  };
  const handleSectionChange = async (index) => {
    // Prevent skipping sections by validating all previous sections
    if (index > activeSectionIndex) {
      for (let i = 0; i < index; i++) {
        const sectionFields = formSchema.form.groups[i].fields.map((field) => field.name);
        const isValid = await trigger(sectionFields); // Validate each section in sequence
  
        if (!isValid) {
          toast.error(`Please complete Section ${i + 1} before proceeding.`);
          return; // Stop navigation if any section is invalid
        }
      }
    }
  
    setActiveSectionIndex(index); // Navigate to the intended section if all previous sections are valid
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white p-6 border-r border-gray-200">
        <Sidebar onSectionChange={handleSectionChange}/>
      </div>

      {/* Form Content */}
      <div className="w-3/4 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">{formSchema.form.title}</h1>

          {/* Tabs or Section Headers */}
          <div className="flex space-x-8 border-b pb-4 mb-6">
            {formSchema.form.groups.map((group, idx) => (
              <button
                key={group.title}
                className={`flex items-center space-x-2 ${activeSectionIndex === idx ? 'text-blue-600' : ''}`}
                type="button"
                onClick={() => handleSectionClick(idx)}
              >
                <span>{group.title}</span>
              </button>
            ))}
          </div>

          {/* Render Fields of the Active Section */}
          {formSchema.form.groups
            .filter((group, idx) => idx === activeSectionIndex) // Only render fields from the active section
            .map((group, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-6">
                {group.fields.map((field) => (
                  <RenderField
                    key={field.name}
                    field={field}
                    register={register}
                    control={control}
                    errors={errors}
                  />
                ))}
              </div>
            ))}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {activeSectionIndex > 0 && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handlePreviousSection}
              >
                Previous
              </button>
            )}
            {activeSectionIndex < formSchema.form.groups.length - 1 ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleNextSection}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
