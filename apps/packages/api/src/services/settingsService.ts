import {settingsRepository} from "../repositories/settingsRepository.js";
import {UserSettings} from "../types/db.types.js";

export class SettingsService {
    async fetchSettingsByUserId(userId: string): Promise<UserSettings[]> {
        return await settingsRepository.fetchSettingsByUser(userId);
    }

    async upsertGlobalReminderTime(userId: string, globalReminderTime: string | null): Promise<void> {
        await settingsRepository.upsertGlobalReminderTime(userId, globalReminderTime);
    }
}

export const settingsService = new SettingsService()
