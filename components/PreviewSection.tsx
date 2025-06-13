import { CompleteSchema } from "@/lib/constants";
import { Edit3 } from "lucide-react";
import { FormSection } from "./MultiStepForm";

interface PreviewSectionProps {
  data: CompleteSchema;
  onEdit: (sectionKey: FormSection) => void;
}

export const PreviewSection = ({ data, onEdit }: PreviewSectionProps) => {
  const sections = [
    {
      title: "Demographics",
      data: data.demographics,
      sectionKey: "demographics",
    },
    {
      title: "Health Information",
      data: data.health,
      sectionKey: "health",
    },
    {
      title: "Financial Information",
      data: data.financial,
      sectionKey: "financial",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Review Your Information
        </h2>
        <p className="text-gray-600">
          Please review your answers before submitting
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.sectionKey} className="bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {section.title}
            </h3>
            <button
              onClick={() => onEdit(section.sectionKey as FormSection)}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(section.data || {}).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </dt>
                <dd className="text-sm text-gray-900">
                  {value || "Not provided"}
                </dd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
