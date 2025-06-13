"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { completeSchema, CompleteSchema } from "@/lib/constants";
import DemographicForm from "./DemographicForm";
import HealthForm from "./HealthForm";
import FinancialForm from "./FianncialForm";
import { toast } from "sonner";
import { PreviewSection } from "./PreviewSection";

export type FormSection = "demographics" | "health" | "financial";
type FormFieldPath = `${FormSection}.${keyof CompleteSchema[FormSection]}`;

const FORM_CONFIG = {
  steps: ["demographics", "health", "financial"] as const,
  stepFieldCounts: [5, 5, 5],
  fieldMaps: {
    demographics: ["firstName", "lastName", "email", "phone", "dateOfBirth"],
    health: ["height", "weight", "bloodType", "allergies", "medications"],
    financial: [
      "employmentStatus",
      "annualIncome",
      "employer",
      "jobTitle",
      "bankName",
    ],
  } as Record<string, string[]>,
} as const;

interface FormState {
  currentStep: number;
  currentFieldIndex: number;
  isPreview: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialFormState: FormState = {
  currentStep: 0,
  currentFieldIndex: 0,
  isPreview: false,
  isSubmitting: false,
  isLoading: false,
  error: null,
  success: null,
};

export default function MultiStepForm() {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm<CompleteSchema>({
    resolver: zodResolver(completeSchema),
    mode: "onBlur",
    defaultValues: {
      demographics: {},
      health: {},
      financial: {},
    },
  });

  // Memoized calculations
  const totalProgress = useMemo(() => {
    const totalFields = FORM_CONFIG.stepFieldCounts.reduce(
      (sum, count) => sum + count,
      0
    );
    const currentPosition =
      FORM_CONFIG.stepFieldCounts
        .slice(0, formState.currentStep)
        .reduce((sum, count) => sum + count, 0) + formState.currentFieldIndex;
    return (currentPosition / totalFields) * 100;
  }, [formState.currentStep, formState.currentFieldIndex]);

  const currentFieldName = useMemo(() => {
    const stepName = FORM_CONFIG.steps[formState.currentStep];
    return FORM_CONFIG.fieldMaps[stepName]?.[formState.currentFieldIndex] || "";
  }, [formState.currentStep, formState.currentFieldIndex]);

  const isFirstQuestion = useMemo(
    () => formState.currentStep === 0 && formState.currentFieldIndex === 0,
    [formState.currentStep, formState.currentFieldIndex]
  );

  const isLastStep = useMemo(
    () =>
      formState.currentStep === FORM_CONFIG.steps.length - 1 &&
      formState.currentFieldIndex ===
        FORM_CONFIG.stepFieldCounts[formState.currentStep] - 1,
    [formState.currentStep, formState.currentFieldIndex]
  );

  // Update form state helper
  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Clear messages helper
  const clearMessages = useCallback(() => {
    updateFormState({ error: null, success: null });
  }, [updateFormState]);

  const nextQuestion = useCallback(async () => {
    const currentStepName = FORM_CONFIG.steps[formState.currentStep];
    clearMessages();

    const isValid = await trigger(
      `${currentStepName}.${currentFieldName}` as FormFieldPath
    );

    if (!isValid) return;

    if (
      formState.currentFieldIndex <
      FORM_CONFIG.stepFieldCounts[formState.currentStep] - 1
    ) {
      updateFormState({ currentFieldIndex: formState.currentFieldIndex + 1 });
    } else if (formState.currentStep < FORM_CONFIG.steps.length - 1) {
      updateFormState({
        currentStep: formState.currentStep + 1,
        currentFieldIndex: 0,
      });
    } else {
      updateFormState({ isPreview: true });
    }
  }, [
    formState.currentStep,
    formState.currentFieldIndex,
    currentFieldName,
    trigger,
    clearMessages,
    updateFormState,
  ]);

  const prevQuestion = useCallback(() => {
    if (formState.isPreview) {
      updateFormState({ isPreview: false });
      return;
    }

    if (formState.currentFieldIndex > 0) {
      updateFormState({ currentFieldIndex: formState.currentFieldIndex - 1 });
    } else if (formState.currentStep > 0) {
      updateFormState({
        currentStep: formState.currentStep - 1,
        currentFieldIndex:
          FORM_CONFIG.stepFieldCounts[formState.currentStep - 1] - 1,
      });
    }
  }, [
    formState.isPreview,
    formState.currentStep,
    formState.currentFieldIndex,
    updateFormState,
  ]);

  const jumpToSection = useCallback(
    (sectionKey: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sectionIndex = FORM_CONFIG.steps.indexOf(sectionKey as any);
      updateFormState({
        currentStep: sectionIndex,
        currentFieldIndex: 0,
        isPreview: false,
        error: null,
        success: null,
      });
    },
    [updateFormState]
  );

  const resetForm = useCallback(() => {
    reset({
      demographics: {},
      health: {},
      financial: {},
    });
    setFormState(initialFormState);
  }, [reset]);

  const onSubmit = useCallback(
    async (data: CompleteSchema) => {
      updateFormState({
        isSubmitting: true,
        error: null,
        success: null,
      });

      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          updateFormState({
            success: `Form submitted successfully! Submission ID: ${result.data.id}`,
            isSubmitting: false,
          });
          console.log("Form submitted successfully:", result.data);
        } else {
          updateFormState({
            error: result.error || "Failed to submit form. Please try again.",
            isSubmitting: false,
          });
        }
      } catch (error) {
        console.error("Submission error:", error);
        updateFormState({
          error:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred. Please try again.",
          isSubmitting: false,
        });
      }
    },
    [updateFormState]
  );

  // Watch the current field value to enable reactive button state
  const currentFieldPath =
    `${FORM_CONFIG.steps[formState.currentStep]}.${currentFieldName}` as FormFieldPath;
  const currentFieldValue = watch(currentFieldPath);

  const canGoNext = useMemo(() => {
    return (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      String(currentFieldValue).trim() !== ""
    );
  }, [currentFieldValue]);

  // Handle Enter key press - moved to useEffect for better performance
  useEffect(() => {
    if (formState.success) {
      toast("Success", {
        description: `${formState.success}`,
        action: {
          label: "Dismiss",
          onClick: () => {
            updateFormState({ success: null });
            resetForm();
          },
        },
        duration: 10000, // 10 second timeout
        onDismiss: () => {
          // Also reset when toast auto-dismisses after timeout
          updateFormState({ success: null });
          resetForm();
        },
      });
    }
  }, [formState.success, updateFormState, resetForm]);

  useEffect(() => {
    if (formState.error) {
      toast("Error", {
        description: `${formState.error}`,
        action: {
          label: "Dismiss",
          onClick: () => updateFormState({ success: null }),
        },
      });
      updateFormState({ error: null });
    }
  }, [formState.error, updateFormState]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    if (formState.success) {
      toast("Success", {
        description: `${formState.success}`,
        action: {
          label: "Dismiss",
          onClick: () => updateFormState({ success: null }),
        },
      });
      updateFormState({ success: null });
    }
  }, [formState.success, updateFormState]);

  // Loading state
  if (formState.isLoading) {
    return (
      <div className="flex flex-col w-full h-[80vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your form...</p>
        </div>
      </div>
    );
  }

  const renderFormStep = () => {
    const commonProps = {
      control,
      errors,
      currentField: formState.currentFieldIndex,
      onEnter: nextQuestion,
    };

    switch (formState.currentStep) {
      case 0:
        return <DemographicForm {...commonProps} />;
      case 1:
        return <HealthForm {...commonProps} />;
      case 2:
        return <FinancialForm {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary from-primary to-primary/70 h-2 rounded-full transition-all duration-300"
          style={{ width: `${totalProgress}%` }}
          role="progressbar"
          aria-valuenow={totalProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Form completion progress"
        />
      </div>

      {/* Main Container */}
      <div
        key={currentFieldName}
        className={`flex flex-col w-full items-center justify-center px-4 py-8 mt-4 motion-preset-slide-up-lg duration-1500 ${
          formState.isPreview ? "h-[100vh]" : "h-[80vh]"
        }`}
      >
        <div className="w-full max-w-3xl mx-auto">
          <div
            className={`bg-transparent p-8 mb-8 ${
              formState.isPreview
                ? "min-h-[80vh] max-h-[80vh] overflow-y-auto mt-3 mb-0 hide-scrollbar"
                : "min-h-[200px]"
            }`}
          >
            {formState.isPreview ? (
              <>
                <PreviewSection data={getValues()} onEdit={jumpToSection} />

                {/* {formState.error && <ErrorAlert />}
                {formState.success && <SuccessAlert />} */}

                <div className="flex justify-between items-center mb-6">
                  <Button
                    onClick={prevQuestion}
                    variant="outline"
                    className="flex items-center px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    aria-label="Go back to form"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={formState.isSubmitting}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Submit form"
                  >
                    {formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Submit Form
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <>
                {renderFormStep()}

                {/* Navigation Controls */}
                <div className="flex justify-between items-center mt-6">
                  <Button
                    onClick={prevQuestion}
                    disabled={isFirstQuestion}
                    variant="outline"
                    className="flex items-center px-6 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous question"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    onClick={nextQuestion}
                    disabled={!canGoNext}
                    className="flex items-center px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label={isLastStep ? "Review form" : "Next question"}
                  >
                    {isLastStep ? "Review" : "Next"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
