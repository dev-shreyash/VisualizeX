import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbSecondary } from "@/app/lib/database/secondary-database";

// Define the Zod schema for validation
const algorithmSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  steps: z.array(z.string()),
  keyConcepts: z.array(z.string()),
  worstCase: z.string(),
  bestCase: z.string(),
  averageCase: z.string(),
  spaceComplexity: z.string(),
  advantages: z.array(z.string()),
  disadvantages: z.array(z.string()),
  practicalUse: z.array(z.string()),
  codes: z.array(
    z.object({
      language: z.string(),
      code: z.string(),
    })
  ),
  metadataName: z.string(),
  metadataDescription: z.string(),
  metadataImage: z.string(),
  metadataRoute: z.string(),
});

// === CREATE ALGORITHM ===
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedData = algorithmSchema.parse(body);

    // Check for an existing algorithm with the same key
    const existingAlgorithm = await dbSecondary.algorithm.findUnique({
      where: { key: validatedData.key },
    });

    if (existingAlgorithm) {
      return NextResponse.json(
        { success: false, message: "Algorithm with this key already exists" },
        { status: 400 }
      );
    }

    // Create the new algorithm with related codes
    const newAlgorithm = await dbSecondary.algorithm.create({
      data: {
        key: validatedData.key,
        name: validatedData.name,
        description: validatedData.description,
        steps: validatedData.steps,
        keyConcepts: validatedData.keyConcepts,
        worstCase: validatedData.worstCase,
        bestCase: validatedData.bestCase,
        averageCase: validatedData.averageCase,
        spaceComplexity: validatedData.spaceComplexity,
        advantages: validatedData.advantages,
        disadvantages: validatedData.disadvantages,
        practicalUse: validatedData.practicalUse,
        metadataName: validatedData.metadataName,
        metadataDescription: validatedData.metadataDescription,
        metadataImage: validatedData.metadataImage,
        metadataRoute: validatedData.metadataRoute,
        codes: {
          create: validatedData.codes, // Create related code entries
        },
      },
      include: { codes: true }, // Include the related codes in the response
    });

    return NextResponse.json(
      { success: true, data: newAlgorithm, message: "Algorithm created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating algorithm:", error);
    return handleError(error);
  }
}

// === UPDATE ALGORITHM ===
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { key, ...updateFields } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Key is required for updating an algorithm" },
        { status: 400 }
      );
    }

    // Update the algorithm and codes if provided
    const updatedAlgorithm = await dbSecondary.algorithm.update({
      where: { key },
      data: {
        ...updateFields,
        codes: updateFields.codes
          ? {
              deleteMany: {}, // Clear existing codes
              create: updateFields.codes, // Add new codes
            }
          : undefined,
      },
      include: { codes: true }, // Include related codes in the response
    });

    return NextResponse.json(
      { success: true, data: updatedAlgorithm, message: "Algorithm updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating algorithm:", error);
    return handleError(error);
  }
}

// === DELETE ALGORITHM ===
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Key is required to delete an algorithm" },
        { status: 400 }
      );
    }

    // Delete the algorithm and its related codes
    await dbSecondary.algorithm.delete({
      where: { key },
    });

    return NextResponse.json(
      { success: true, message: "Algorithm deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting algorithm:", error);
    return handleError(error);
  }
}

// === GET ALL ALGORITHMS ===
export async function GET(req: NextRequest) {
  try {
    // Fetch all algorithms and their codes
    const algorithms = await dbSecondary.algorithm.findMany({
      include: { codes: true },
    });

    return NextResponse.json(
      { success: true, data: algorithms },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching algorithms:", error);
    return handleError(error);
  }
}

// === HELPER FUNCTION FOR ERROR HANDLING ===
function handleError(error: any) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, message: "Validation error", errors: error.errors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: false, message: "An error occurred", error: error.message },
    { status: 500 }
  );
}
