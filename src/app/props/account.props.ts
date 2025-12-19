import {Account} from "@/app/models/Account";

export interface AccountViewProps {
    accounts: Account[]
    currentAccountId: string | null
    onAddWorkspace: (name: string) => void
    onUpdateAccount: (accountId: string, name: string) => void
    onDeleteAccount: (accountId: string) => void
    onSwitchAccount: (accountId: string) => void
}
