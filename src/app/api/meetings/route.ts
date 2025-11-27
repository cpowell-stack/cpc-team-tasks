import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { google } from "googleapis";
import { sendEmail } from "@/lib/email";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Meetings not supported in Google Sheets backend yet
    return NextResponse.json([]);
}

export async function POST(request: Request) {
    return NextResponse.json({ error: "Meetings not supported yet" }, { status: 501 });
}
