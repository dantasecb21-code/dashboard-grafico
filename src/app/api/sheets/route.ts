import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const base = process.env.APPS_SCRIPT_URL;

  if (!base) {
    return NextResponse.json({ error: "APPS_SCRIPT_URL nao configurada" }, { status: 500 });
  }

  const sheet = req.nextUrl.searchParams.get("sheet");
  const url = sheet ? `${base}?sheet=${encodeURIComponent(sheet)}` : base;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
