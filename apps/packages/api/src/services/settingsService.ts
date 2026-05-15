import {settingsRepository} from "../repositories/settingsRepository";
import {UserSettings} from "../types/db.types";

export class SettingsService {
    async fetchSettingsByUserId(userId: string): Promise<UserSettings[]> {
        return await settingsRepository.fetchSettingsByUser(userId);
    }

    async upsertGlobalReminderTime(userId: string, globalReminderTime: string | null): Promise<void> {
        await settingsRepository.upsertGlobalReminderTime(userId, globalReminderTime);
    }
}

export const settingsService = new SettingsService()
