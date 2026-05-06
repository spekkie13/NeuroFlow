import { StyleSheet } from 'react-native'

// Settings screen styles
export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },

    // Profile card
    profileCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    profileRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    profileEmailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    profileEmailIcon: {
        marginRight: 4,
    },
    profileEmail: {
        fontSize: 13,
        color: '#4b5563',
    },
    providerBadgeRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    providerBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: '#dbeafe',
    },
    providerBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1d4ed8',
    },

    // Section header
    sectionHeader: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },

    // Add workspace card
    addCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 16,
        marginBottom: 16,
    },
    addTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 8,
    },
    addTitleIcon: {
        marginRight: 6,
    },
    addTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 8,
    },
    addCancelButton: {
        marginLeft: 8,
    },
    addCreateButton: {
        marginLeft: 8,
    },
    addInlineActions: {
        flexDirection: 'row',
        gap: 8,
    },
    addGhostButton: {
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#d1d5db',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addGhostText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4b5563',
    },

    // Workspaces list
    listCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
        flex: 1,
    },
    listHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    listHeaderTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    listEmptyState: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    listEmptyIcon: {
        marginBottom: 8,
    },
    listEmptyTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#4b5563',
        marginBottom: 2,
    },
    listEmptySubtitle: {
        fontSize: 12,
        color: '#9ca3af',
    },

    workspaceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    workspaceRowActive: {
        backgroundColor: '#eff6ff',
    },
    workspaceAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    workspaceAvatarActive: {
        backgroundColor: '#dbeafe',
    },
    workspaceAvatarDefault: {
        backgroundColor: '#e5e7eb',
    },
    workspaceAvatarIcon: {
        opacity: 0.9,
    },
    workspaceTextContainer: {
        flex: 1,
        minWidth: 0,
    },
    workspaceNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    workspaceName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    workspaceNameActive: {
        color: '#1d4ed8',
    },
    workspaceActiveBadge: {
        marginLeft: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 999,
        backgroundColor: '#dbeafe',
    },
    workspaceActiveBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#1d4ed8',
    },
    workspaceCreatedAt: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },

    workspaceActions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        gap: 4,
    },

    // Daily budget
    budgetSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 10,
        lineHeight: 16,
    },
    budgetRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    budgetChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    budgetChipActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    budgetChipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    budgetChipTextActive: {
        color: '#2563eb',
        fontWeight: '600',
    },

    // Inline editing
    inlineEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    // Layout helpers
    row: {
        flexDirection: 'row',
    },
    grow: {
        flex: 1,
    },

    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#fef2f2',
    },
    signOutText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#b91c1c',
    },

    // Notification reminder
    reminderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    reminderTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    reminderTimeButtonActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#2563eb',
    },
    reminderTimeText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
    },
    reminderTimeTextActive: {
        color: '#2563eb',
        fontWeight: '600',
    },
    reminderOffButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#f9fafb',
    },
    reminderOffText: {
        fontSize: 13,
        color: '#6b7280',
    },
    reminderDoneButton: {
        alignSelf: 'flex-end',
        marginTop: 8,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#2563eb',
    },
    reminderDoneText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#ffffff',
    },

    localInfoCard: {
        marginTop: 8,
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#EFF6FF', // zachte blauw-tint
    },

    localInfoTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1D4ED8', // zelfde blauw als elders in je app
        marginBottom: 2,
    },

    localInfoText: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 16,
    },
})
