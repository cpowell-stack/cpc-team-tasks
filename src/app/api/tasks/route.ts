import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prisma.task.findMany({
        include: {
            assignee: true,
            meeting: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const json = await request.json();
        const { title, description, assigneeId, meetingId } = json;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                assigneeId,
                meetingId,
            },
            include: {
                assignee: true,
            },
        });

        if (task.assignee && task.assignee.email) {
            await sendEmail({
                to: task.assignee.email,
                subject: `New Task Assigned: ${title}`,
                text: `You have been assigned a new task: ${title}\n\nDescription: ${description || "No description"}\n\nView it at: ${process.env.NEXTAUTH_URL}/tasks`,
            });
        }

        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ error: "Error creating task" }, { status: 500 });
    }
}
