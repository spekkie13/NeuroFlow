import { Account, User } from '../utils/types'

export interface AccountViewProps {
    accounts: Account[]
    currentAccountId: string | null
    onAddAccount: (name: string) => void
    onUpdateAccount: (accountId: string, name: string) => void
    onDeleteAccount: (accountId: string) => void
    onSwitchAccount: (accountId: string) => void
    user: User
    onLogout: () => void
}
