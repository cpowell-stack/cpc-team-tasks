'use server';

import { taskRepository } from '@/lib/repositories/TaskRepository';
import { userRepository } from '@/lib/repositories/UserRepository';
import { teamRepository } from '@/lib/repositories/TeamRepository';
import { revalidatePath } from 'next/cache';

export async function updateTask(id: string, data: any) {
    await taskRepository.updateTask(id, data);
    revalidatePath('/tasks');
}

export async function updateUser(id: string, data: any) {
    await userRepository.updateUser(id, data);
    revalidatePath('/users');
}

export async function updateTeam(id: string, data: any) {
    await teamRepository.updateTeam(id, data);
    revalidatePath('/teams');
}

export async function updateMeeting(id: string, data: any) {
    // await prisma.meeting.update({
    //     where: { id },
    //     data,
    // });
    console.warn('updateMeeting not implemented for Google Sheets backend yet.');
    revalidatePath('/meetings');
}
