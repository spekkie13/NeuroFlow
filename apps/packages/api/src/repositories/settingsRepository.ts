import {userSettings} from "../db/schema";
import { db } from '../db/index.js'
import {eq} from "drizzle-orm";
import {UserSettings} from "../types/db.types";

export class SettingsRepository {
    async fetchSettingsByUser(userId: string): Promise<UserSettings[]> {
        return await db
            .select()
            .from(userSettings)
            .where(eq(userSettings.userId, userId));
    }

    async upsertGlobalReminderTime(userId: string, globalReminderTime: string | null): Promise<void> {
        await db
            .insert(userSettings)
            .values({
                userId: userId,
                globalReminderTime,
                updatedAt: new Date(),
            })
            .onConflictDoUpdate({
                target: userSettings.userId,
                set: {
                    globalReminderTime,
                    updatedAt: new Date(),
                },
            })
    }
}

export const settingsRepository = new SettingsRepository()
