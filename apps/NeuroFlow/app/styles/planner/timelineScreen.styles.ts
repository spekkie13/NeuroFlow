import { StyleSheet } from 'react-native';

export const timelineScreenStyles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
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
        textAlign: 'center',
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 4,
    },
    timelineHeaderTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    timelineHeaderSubtitle: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    projectTodayButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#2563eb',
    },
    projectTodayButtonText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2563eb',
    },
    timelineScroll: {
        flex: 1,
    },
    timelineContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24,
    },
    projectSection: {
        marginBottom: 32,
    },
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    projectHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 1,
    },
    projectColorDot: {
        width: 16,
        height: 16,
        borderRadius: 999,
        marginRight: 12,
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
    },
    projectUnscheduledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fed7aa',
        gap: 4,
    },
    projectUnscheduledText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#92400e',
    },
})
