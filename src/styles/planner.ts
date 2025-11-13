import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    container: {
        flex: 1,
        paddingBottom: 70,
    },
    timelineContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    timelineBlock: {
        marginBottom: 24,
    },
    timelineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 9999,
        marginRight: 6,
    },
    timelineTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
    },
    emptyTimeline: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
    },

    emptyWorkspace: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    wsSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    createWorkspaceBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    createWorkspaceBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
