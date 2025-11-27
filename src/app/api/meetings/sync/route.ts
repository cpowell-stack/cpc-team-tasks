import { NextResponse } from "next/server";

export async function POST(request: Request) {
    return NextResponse.json({ error: "Meetings sync not supported yet" }, { status: 501 });
}
