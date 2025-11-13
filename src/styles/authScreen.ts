import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2FF',
    },
    screenContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    container: {
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
    },
    brand: {
        alignItems: 'center',
        marginBottom: 20,
    },
    brandIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
    },
    subtitle: {
        color: '#6B7280',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
    },
    tabRow: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#DBEAFE',
        borderBottomWidth: 2,
        borderBottomColor: '#2563EB',
    },
    tabText: {
        fontWeight: '600',
        color: '#6B7280',
    },
    tabTextActive: {
        color: '#2563EB',
    },
    cardBody: {
        padding: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    googleIcon: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#EA4335', // fake google
    },
    googleText: {
        fontWeight: '500',
        color: '#374151',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 8,
        color: '#6B7280',
        fontSize: 12,
    },
    errorBox: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 13,
    },
    field: {
        marginBottom: 12,
    },
    label: {
        fontWeight: '500',
        marginBottom: 6,
        color: '#374151',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 12,
        paddingHorizontal: 8,
    },
    inputIcon: {
        marginHorizontal: 4,
    },
    input: {
        flex: 1,
        paddingHorizontal: 6,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
    },
    hint: {
        marginTop: 4,
        fontSize: 11,
        color: '#9CA3AF',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    checkboxCheck: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    checkboxLabel: {
        marginLeft: 6,
        color: '#4B5563',
        fontSize: 13,
    },
    link: {
        color: '#2563EB',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 6,
        elevation: 1,
    },
    submitText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    agreement: {
        marginTop: 12,
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    footer: {
        marginTop: 16,
        alignItems: 'center',
    },
    footerText: {
        color: '#6B7280',
    },
    footerLink: {
        color: '#2563EB',
        fontWeight: '600',
    },
});
