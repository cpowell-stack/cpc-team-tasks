import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CALENDAR_ID = "covpres.com_dc562c5ebaa7a281e28790e5da83ea42@group.calendar.google.com";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const auth = new google.auth.OAuth2();
        auth.setCredentials({ access_token: session.accessToken as string });

        const calendar = google.calendar({ version: "v3", auth });

        // Fetch upcoming events
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 20,
            singleEvents: true,
            orderBy: "startTime",
        });

        const events = response.data.items || [];
        let syncedCount = 0;

        for (const event of events) {
            if (!event.start?.dateTime && !event.start?.date) continue;
            if (!event.id) continue;

            const eventDate = new Date(event.start.dateTime || event.start.date!);
            const title = event.summary || "Untitled Meeting";

            // Check if meeting already exists by Google Event ID
            const existingMeeting = await prisma.meeting.findFirst({
                where: { googleEventId: event.id },
            });

            if (existingMeeting) {
                await prisma.meeting.update({
                    where: { id: existingMeeting.id },
                    data: {
                        title,
                        date: eventDate,
                    },
                });
            } else {
                await prisma.meeting.create({
                    data: {
                        title,
                        date: eventDate,
                        googleEventId: event.id,
                        organizerId: session.user.id,
                    },
                });
            }
            syncedCount++;
        }

        return NextResponse.json({ message: `Synced ${syncedCount} events`, count: syncedCount });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Failed to sync events" }, { status: 500 });
    }
}
