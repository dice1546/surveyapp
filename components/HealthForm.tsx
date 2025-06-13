import { CompleteSchema } from "@/lib/constants";
import { ArrowRight, CircleHelp } from "lucide-react";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";

type HealthField = keyof CompleteSchema["health"];

interface HealthFormProps {
  control: Control<CompleteSchema>;
  errors: FieldErrors<CompleteSchema>;
  currentField: number;
  onEnter: () => void;
}

const HealthForm = ({
  control,
  errors,
  currentField,
  onEnter,
}: HealthFormProps) => {
  const fields: Array<{
    name: HealthField;
    label: string;
    type: string;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    description?: string;
  }> = [
    {
      name: "height",
      label: "Height (in feet and inches)",
      type: "text",
      placeholder: "e.g., 5'10\"",
      description: "Please enter your height in feet and inches",
    },
    {
      name: "weight",
      label: "Weight (in pounds)",
      type: "text",
      placeholder: "Enter your weight",
      description: "Please enter your weight in pounds",
    },
    {
      name: "bloodType",
      label: "Blood Type",
      type: "select",
      options: [
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" },
        { value: "unknown", label: "Unknown" },
      ],
      description: "Please select your blood type",
    },
    {
      name: "allergies",
      label: "Known Allergies",
      type: "textarea",
      placeholder: "List any allergies (optional)",
      description: "Please list any known allergies",
    },
    {
      name: "medications",
      label: "Current Medications",
      type: "textarea",
      placeholder: "List current medications (optional)",
      description: "Please list any medications you are currently taking",
    },
  ];

  const field = fields[currentField];
  if (!field) return null;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500">Health Information</div>
      {/* Animated container for the field content */}
      <div key={currentField} className="motion-preset-slide-up space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 inline-flex items-center gap-2">
            {currentField + 1}
            <ArrowRight className="text-slate-800 h-3 w-3" />
            {field.label}
          </h2>

          <HoverCard>
            <HoverCardTrigger className="text-sm font-bold text-slate-600 cursor-help ml-2 px-3 py-1.5 rounded-full">
              <CircleHelp className="h-4 w-4 text-slate-600" />
            </HoverCardTrigger>
            <HoverCardContent className="bg-slate-200">
              {field.description}
            </HoverCardContent>
          </HoverCard>
        </div>

        <Controller
          name={`health.${field.name}` as const}
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-2">
              {field.type === "select" ? (
                <select
                  value={value || ""}
                  onChange={onChange}
                  style={{
                    paddingLeft: 0,
                    marginLeft: 0,
                    textIndent: 0,
                  }}
                  className="w-full p-4 border-b-[1px] border-slate-600 focus:border-b-[1px] focus:border-b-slate-900 text-lg"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-200 p-2 border-transparent border-b-[1px]"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={value || ""}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full p-4 border-[1px] border-slate-400 rounded-lg focus:border-[1px] focus:border-slate-900 resize-none"
                />
              ) : (
                <Input
                  type={field.type}
                  value={value || ""}
                  onChange={onChange}
                  onKeyDown={handleKeyDown}
                  placeholder={field.placeholder}
                />
              )}
              {errors?.health?.[field.name] && (
                <p className="text-red-500 text-sm">
                  {errors.health[field.name]?.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default HealthForm;
