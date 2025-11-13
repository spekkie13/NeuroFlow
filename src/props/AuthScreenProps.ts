import {User} from "@/app/utils/auth";

export interface AuthScreenProps {
    onLogin: (user: User) => void;
}
