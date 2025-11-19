import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { google } from "googleapis";
import { sendEmail } from "@/lib/email";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const meetings = await prisma.meeting.findMany({
        include: {
            organizer: true,
            tasks: true,
        },
        orderBy: {
            date: "asc",
        },
    });

    return NextResponse.json(meetings);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const json = await request.json();
        const { title, date } = json;
        const meetingDate = new Date(date);

        let googleEventId = null;

        // Sync with Google Calendar if access token is available
        if (session.accessToken) {
            try {
                const auth = new google.auth.OAuth2();
                auth.setCredentials({ access_token: session.accessToken });

                const calendar = google.calendar({ version: "v3", auth });

                const event = await calendar.events.insert({
                    calendarId: "primary",
                    requestBody: {
                        summary: title,
                        start: {
                            dateTime: meetingDate.toISOString(),
                        },
                        end: {
                            dateTime: new Date(meetingDate.getTime() + 60 * 60 * 1000).toISOString(), // Default 1 hour duration
                        },
                    },
                });

                googleEventId = event.data.id;
            } catch (calendarError) {
                console.error("Error syncing with Google Calendar:", calendarError);
                // Continue creating meeting even if sync fails
            }
        }

        const meeting = await prisma.meeting.create({
            data: {
                title,
                date: meetingDate,
                organizerId: session.user.id,
                googleEventId,
            },
            include: {
                organizer: true,
            },
        });

        if (meeting.organizer && meeting.organizer.email) {
            await sendEmail({
                to: meeting.organizer.email,
                subject: `Meeting Scheduled: ${title}`,
                text: `You have successfully scheduled a meeting: ${title}\n\nDate: ${meetingDate.toLocaleString()}\n\nView it at: ${process.env.NEXTAUTH_URL}/meetings`,
            });
        }

        return NextResponse.json(meeting);
    } catch (error) {
        console.error("Error creating meeting:", error);
        return NextResponse.json({ error: "Error creating meeting" }, { status: 500 });
    }
}
