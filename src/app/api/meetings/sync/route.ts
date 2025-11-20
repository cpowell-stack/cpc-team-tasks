import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGoogleCalendarClient } from "@/lib/google";

const CALENDAR_ID = "covpres.com_dc562c5ebaa7a281e28790e5da83ea42@group.calendar.google.com";

export async function POST() {
    try {
        const calendar = await getGoogleCalendarClient();

        // 1. Fetch upcoming events from Google Calendar
        const response = await calendar.events.list({
            calendarId: CALENDAR_ID,
            timeMin: new Date().toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: "startTime",
        });

        const googleEvents = response.data.items || [];
        let syncedCount = 0;

        // 2. Sync Google Events -> Database
        for (const event of googleEvents) {
            if (!event.start?.dateTime && !event.start?.date) continue;
            if (!event.id) continue;

            const eventDate = new Date(event.start.dateTime || event.start.date!);
            const title = event.summary || "Untitled Meeting";

            // Check if meeting already exists by Google Event ID
            const existingMeeting = await prisma.meeting.findFirst({
                where: { googleEventId: event.id },
            });

            if (existingMeeting) {
                // Update existing meeting if details changed
                if (existingMeeting.title !== title || existingMeeting.date.getTime() !== eventDate.getTime()) {
                    await prisma.meeting.update({
                        where: { id: existingMeeting.id },
                        data: {
                            title,
                            date: eventDate,
                        },
                    });
                }
            } else {
                // Create new meeting
                // Note: We need a fallback organizer since this is a system sync. 
                // Ideally, we'd match email attendees to users, but for now we'll pick the first admin or leave it null if schema allows (schema requires organizer).
                // Let's find a default user to assign as "organizer" for imported events.
                const defaultUser = await prisma.user.findFirst();

                if (defaultUser) {
                    await prisma.meeting.create({
                        data: {
                            title,
                            date: eventDate,
                            googleEventId: event.id,
                            organizerId: defaultUser.id,
                        },
                    });
                }
            }
            syncedCount++;
        }

        return NextResponse.json({ message: `Synced ${syncedCount} events from Google Calendar`, count: syncedCount });
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: "Failed to sync events" }, { status: 500 });
    }
}
