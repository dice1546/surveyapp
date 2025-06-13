import { CompleteSchema } from "@/lib/constants";
import { createClient } from "@/lib/supabase/serverCleint";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient(); // ✅ Await the client creation
    const formData: CompleteSchema = await request.json();

    const submissionData = {
      demographics: formData.demographics,
      health: formData.health,
      financial: formData.financial,
      status: "completed" as const,
      created_at: new Date().toISOString(),
    };

    // ✅ Now you can use normal syntax
    const { data, error } = await supabase
      .from("form_submissions")
      .insert(submissionData)
      .select("id")
      .single();

    if (error) {
      console.error("Supabase submission error", error);
      return NextResponse.json(
        {
          data: null,
          error: `Failed to submit form: ${error.message}`,
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data,
      error: null,
      success: true,
    });
  } catch (error) {
    console.error("Unexpected error occurred saving to supabase", error);
    return NextResponse.json(
      {
        data: null,
        error: "An unexpected error occurred",
        success: false,
      },
      { status: 500 }
    );
  }
}
