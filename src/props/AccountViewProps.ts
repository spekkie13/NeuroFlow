import {Account} from "@/app/utils/types";
import {User as userAuth} from "@/app/utils/auth";

export interface AccountViewProps {
    accounts: Account[];
    currentAccountId: string | null;
    onAddAccount: (name: string) => void;
    onUpdateAccount: (accountId: string, name: string) => void;
    onDeleteAccount: (accountId: string) => void;
    onSwitchAccount: (accountId: string) => void;
    user: userAuth;
    onLogout: () => void;
}
