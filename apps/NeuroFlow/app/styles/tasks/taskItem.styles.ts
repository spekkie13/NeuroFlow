import { StyleSheet } from 'react-native'

export const taskItemStyles = StyleSheet.create({
    taskItem: {
        marginBottom: 10,
        position: 'relative', // ✅ nodig voor zIndex stacking
    },
    taskItemMenuOpen: {
        zIndex: 9999,     // ✅ tilt deze hele task boven de rest
        elevation: 9999,  // ✅ Android
    },
    swipeBgUndo: {
        backgroundColor: '#6b7280',
    },
    swipeBgComplete: {
        backgroundColor: '#22c55e',
    },
    swipeBgContent: {
        position: 'absolute',
        left: 16,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    swipeBgLabel: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 13,
    },
    taskItemInner: {
        position: 'relative',
    },

    taskItemInnerMenuOpen: {
        zIndex: 9999,
        elevation: 9999,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 10,
        backgroundColor: '#ffffff',
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    leftCol: {
        flex: 1,
        paddingRight: 10,
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 26,
        columnGap: 10,
    },
    checkbox: {
        marginRight: 2,
    },
    taskName: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
        lineHeight: 18,
    },
    taskNameCompleted: {
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 18,
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 16,
        includeFontPadding: false as any,
    },
    dateTextOverdue: {
        color: '#b91c1c',
        fontWeight: '500',
    },
    estimateBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    estimateBadge: {
        fontSize: 11,
        fontWeight: '500',
        color: '#6b7280',
    },
    dateRowPlaceholder: {
        height: 18,
        width: 1,
    },
    rightCol: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
    },
    priorityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        borderWidth: 1,
        paddingHorizontal: 10,
        height: 24,
        paddingVertical: 0,
        flexShrink: 0,
    },
    priorityHigh: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    priorityMedium: {
        backgroundColor: '#fefce8',
        borderColor: '#fef3c7',
    },
    priorityLow: {
        backgroundColor: '#ecfdf3',
        borderColor: '#bbf7d0',
    },
    priorityText: {
        fontSize: 11,
        fontWeight: '600',
        marginLeft: 4,
        textTransform: 'capitalize',
        color: '#111827',
        lineHeight: 14,
        includeFontPadding: false as any,
        textAlignVertical: 'center' as any,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        height: 28,
    },
    stepsToggleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 28,
        paddingHorizontal: 4,
        gap: 3,
    },
    stepsCountText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#2563eb',
    },
    stepsArea: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 8,
        gap: 4,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 3,
    },
    stepCheckbox: {
        flexShrink: 0,
    },
    stepText: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
        lineHeight: 18,
    },
    stepTextDone: {
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    stepDelete: {
        padding: 4,
        flexShrink: 0,
    },
    addStepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        paddingLeft: 2,
    },
    addStepInput: {
        flex: 1,
        fontSize: 13,
        color: '#374151',
        paddingVertical: 4,
        paddingHorizontal: 0,
    },
    notesArea: {
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 8,
    },
    notesInput: {
        fontSize: 13,
        color: '#374151',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 8,
        minHeight: 60,
        backgroundColor: '#f9fafb',
        textAlignVertical: 'top' as any,
    },
    notesActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 4,
        gap: 4,
    },
    inlineMenu: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
        padding: 6,
        minWidth: 240,  // ✅ wider so labels stay next to icons
        maxWidth: 280,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
    },
    inlineMenuDivider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 6,
        marginHorizontal: 6,
        opacity: 0.7,
    },
})
