import {User} from "@/app/utils/auth";

export interface SettingsViewProps {
    user: User;
    onLogout: () => void;
}
