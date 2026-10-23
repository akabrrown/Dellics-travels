import { NextResponse } from "next/server";
import { DEFAULT_CATALOG_SCHOOLS, CatalogSchool } from "@/lib/consult-catalog";

// In-memory catalog cache for the Next.js process lifetime
let catalogSchoolsStore: CatalogSchool[] = [...DEFAULT_CATALOG_SCHOOLS];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase();
  const country = searchParams.get("country")?.toLowerCase();
  const level = searchParams.get("level")?.toLowerCase();

  let results = [...catalogSchoolsStore];

  if (query) {
    results = results.filter((school) => {
      const matchName = school.name.toLowerCase().includes(query);
      const matchCity = school.city.toLowerCase().includes(query);
      const matchCountry = school.location.toLowerCase().includes(query);
      const matchProg = school.programmes.some((p) => p.toLowerCase().includes(query));
      return matchName || matchCity || matchCountry || matchProg;
    });
  }

  if (country && country !== "all") {
    results = results.filter((s) => s.location.toLowerCase().includes(country));
  }

  if (level && level !== "all") {
    results = results.filter((s) => s.level.toLowerCase().includes(level));
  }

  return NextResponse.json(
    {
      success: true,
      data: results,
      total: results.length,
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    if (!payload.name || !payload.location) {
      return NextResponse.json(
        { success: false, error: "University name and location are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const schoolId = payload.id || `school-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newSchool: CatalogSchool = {
      id: schoolId,
      name: payload.name.trim(),
      level: payload.level || "Undergraduate & Postgraduate",
      programmes: Array.isArray(payload.programmes)
        ? payload.programmes.filter(Boolean)
        : typeof payload.programmes === "string"
        ? payload.programmes.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      location: payload.location.trim(),
      city: payload.city ? payload.city.trim() : "",
      tuition: payload.tuition ? payload.tuition.trim() : "Contact admissions",
      applicationFee: payload.applicationFee ? payload.applicationFee.trim() : "Free",
      intake: payload.intake || "Sep 2026",
      ranking: payload.ranking || "",
      scholarshipCoverage: payload.scholarshipCoverage || "",
      badges: {
        highJobDemand: Boolean(payload.badges?.highJobDemand),
        noVisaCap: Boolean(payload.badges?.noVisaCap),
        loans: Boolean(payload.badges?.loans),
        prime: Boolean(payload.badges?.prime),
        top: Boolean(payload.badges?.top),
        popular: Boolean(payload.badges?.popular),
        fastAcceptance: Boolean(payload.badges?.fastAcceptance),
      },
      createdAt: payload.createdAt || now,
      updatedAt: now,
    };

    const existingIndex = catalogSchoolsStore.findIndex((s) => s.id === schoolId);
    if (existingIndex >= 0) {
      catalogSchoolsStore[existingIndex] = newSchool;
    } else {
      catalogSchoolsStore.unshift(newSchool);
    }

    return NextResponse.json(
      {
        success: true,
        message: "University saved to Consult search feed successfully.",
        data: newSchool,
        total: catalogSchoolsStore.length,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Invalid payload." },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "School ID parameter required." },
        { status: 400, headers: corsHeaders }
      );
    }

    catalogSchoolsStore = catalogSchoolsStore.filter((s) => s.id !== id);

    return NextResponse.json(
      {
        success: true,
        message: "School removed from catalog feed.",
        total: catalogSchoolsStore.length,
      },
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to remove school." },
      { status: 500, headers: corsHeaders }
    );
  }
}
