import { StyleSheet } from 'react-native'

export const taskViewStyles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        marginBottom: 8,
    },
    projectName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    headerMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerMetaText: {
        fontSize: 12,
        color: '#6b7280',
    },
    headerMetaNumber: {
        fontWeight: '600',
        color: '#111827',
    },
    headerMetaDot: {
        marginHorizontal: 4,
        fontSize: 12,
        color: '#9ca3af',
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterBar: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 12,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
    },
    filterChipActive: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    filterChipTextActive: {
        color: '#ffffff',
    },
    emptyState: {
        paddingVertical: 32,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#e5e7eb',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9ca3af',
    },
    list: {
        gap: 8,
    },
    completedSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 2,
        marginTop: 4,
        marginBottom: 4,
    },
    completedSectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    section: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    addButton: {
        padding: 2,
    },
    emptyText: {
        fontSize: 13,
        color: '#9ca3af',
        textAlign: 'center',
        paddingVertical: 12,
    },
})
