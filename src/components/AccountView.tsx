import React, { useState } from 'react';
import { Account } from '../utils/types';
import { User, logout } from '../utils/auth';
import { PlusIcon, CheckIcon, EditIcon, TrashIcon, UserIcon, LogOutIcon, MailIcon } from 'lucide-react';
interface AccountViewProps {
  accounts: Account[];
  currentAccountId: string | null;
  onAddAccount: (name: string) => void;
  onUpdateAccount: (accountId: string, name: string) => void;
  onDeleteAccount: (accountId: string) => void;
  onSwitchAccount: (accountId: string) => void;
  user: User;
  onLogout: () => void;
}
export function AccountView({
  accounts,
  currentAccountId,
  onAddAccount,
  onUpdateAccount,
  onDeleteAccount,
  onSwitchAccount,
  user,
  onLogout
}: AccountViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const handleAdd = () => {
    if (newAccountName.trim()) {
      onAddAccount(newAccountName);
      setNewAccountName('');
      setIsAdding(false);
    }
  };
  const handleEdit = (accountId: string) => {
    if (editName.trim()) {
      onUpdateAccount(accountId, editName);
      setEditingId(null);
    }
  };
  const startEdit = (account: Account) => {
    setEditingId(account.id);
    setEditName(account.name);
  };
  const handleLogout = () => {
    logout();
    onLogout();
  };
  return <div className="max-w-2xl mx-auto px-6 py-8">
      {/* User Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <MailIcon size={14} className="text-gray-400" />
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
            <LogOutIcon size={18} />
            Log Out
          </button>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Workspace Management
        </h3>
        <p className="text-gray-600">
          Manage your workspaces and switch between them
        </p>
      </div>
      {/* Add Account Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
          <PlusIcon size={20} className="mr-2" />
          Add New Workspace
        </h3>
        {isAdding ? <div className="flex gap-2">
            <input type="text" value={newAccountName} onChange={e => setNewAccountName(e.target.value)} placeholder="Workspace name" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" autoFocus onKeyDown={e => e.key === 'Enter' && handleAdd()} />
            <button onClick={handleAdd} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Add
            </button>
            <button onClick={() => {
          setIsAdding(false);
          setNewAccountName('');
        }} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Cancel
            </button>
          </div> : <button onClick={() => setIsAdding(true)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium">
            + Create New Workspace
          </button>}
      </div>
      {/* Accounts List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Your Workspaces</h3>
        </div>
        {accounts.length === 0 ? <div className="px-6 py-12 text-center text-gray-500">
            <UserIcon size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-1">No workspaces yet</p>
            <p className="text-sm">
              Create your first workspace to get started
            </p>
          </div> : <div className="divide-y divide-gray-200">
            {accounts.map(account => <div key={account.id} className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${currentAccountId === account.id ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${currentAccountId === account.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    <UserIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingId === account.id ? <div className="flex items-center gap-2">
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus onKeyDown={e => e.key === 'Enter' && handleEdit(account.id)} />
                        <button onClick={() => handleEdit(account.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" aria-label="Save">
                          <CheckIcon size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded" aria-label="Cancel">
                          ×
                        </button>
                      </div> : <>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800 truncate">
                            {account.name}
                          </h4>
                          {currentAccountId === account.id && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Active
                            </span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Created{' '}
                          {new Date(account.createdAt).toLocaleDateString()}
                        </p>
                      </>}
                  </div>
                </div>
                {editingId !== account.id && <div className="flex items-center gap-2 ml-4">
                    {currentAccountId !== account.id && <button onClick={() => onSwitchAccount(account.id)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                        Switch
                      </button>}
                    <button onClick={() => startEdit(account)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Edit workspace">
                      <EditIcon size={18} />
                    </button>
                    {accounts.length > 1 && <button onClick={() => onDeleteAccount(account.id)} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" aria-label="Delete workspace">
                        <TrashIcon size={18} />
                      </button>}
                  </div>}
              </div>)}
          </div>}
      </div>
    </div>;
}