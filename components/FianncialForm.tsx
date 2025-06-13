import { CompleteSchema } from "@/lib/constants";
import { ArrowRight, CircleHelp } from "lucide-react";
import React from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";

type FinancialField = keyof CompleteSchema["financial"];

interface FinancialFormProps {
  control: Control<CompleteSchema>;
  errors: FieldErrors<CompleteSchema>;
  currentField: number;
  onEnter: () => void;
}

const FinancialForm = ({
  control,
  errors,
  currentField,
  onEnter,
}: FinancialFormProps) => {
  const fields: Array<{
    name: FinancialField;
    label: string;
    type: string;
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
    description?: string;
  }> = [
    {
      name: "employmentStatus",
      label: "Employment Status",
      type: "select",
      options: [
        { value: "employed", label: "Employed" },
        { value: "unemployed", label: "Unemployed" },
        { value: "self-employed", label: "Self-employed" },
        { value: "retired", label: "Retired" },
        { value: "student", label: "Student" },
      ],
      description: "Select your current employment status",
    },
    {
      name: "annualIncome",
      label: "Annual Income",
      type: "text",
      placeholder: "Enter your annual income",
      description: "Please enter your total annual income before taxes",
    },
    {
      name: "employer",
      label: "Employer Name",
      type: "text",
      placeholder: "Enter employer name (optional)",
      description: "If employed, please enter your employer's name",
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      placeholder: "Enter your job title (optional)",
      description: "If employed, please enter your job title",
    },
    {
      name: "bankName",
      label: "Primary Bank",
      type: "text",
      placeholder: "Enter your bank name",
      description: "Please enter the name of your primary bank",
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
      <div className="text-sm text-gray-500">Financial Information</div>
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
          name={`financial.${field.name}` as const}
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
              ) : (
                <Input
                  type={field.type}
                  value={value || ""}
                  onChange={onChange}
                  onKeyDown={handleKeyDown}
                  placeholder={field.placeholder}
                />
              )}
              {errors?.financial?.[field.name] && (
                <p className="text-red-500 text-sm">
                  {errors.financial[field.name]?.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default FinancialForm;
