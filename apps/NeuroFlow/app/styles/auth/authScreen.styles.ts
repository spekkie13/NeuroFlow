import {StyleSheet} from "react-native";

export const authScreenStyles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoMark: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        shadowColor: '#2563eb',
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#ffffff',
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 6,
    },
    tagline: {
        fontSize: 14,
        color: '#6b7280',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fef2f2',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fecaca',
        padding: 12,
        marginBottom: 16,
    },
    errorIcon: {
        marginRight: 8,
        marginTop: 1,
        flexShrink: 0,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
        color: '#b91c1c',
        lineHeight: 18,
    },

    // Divider
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 12,
        color: '#9ca3af',
        fontWeight: '500',
    },

    // Email toggle row
    emailToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    emailToggleText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },

    // Email form
    emailForm: {
        marginTop: 16,
        gap: 0,
    },
    fieldGap: {
        marginTop: 12,
    },
    emailSubmit: {
        marginTop: 18,
    },
    modeToggle: {
        alignItems: 'center',
        marginTop: 14,
    },
    modeToggleText: {
        fontSize: 13,
        color: '#6b7280',
    },
    modeToggleLink: {
        color: '#2563eb',
        fontWeight: '600',
    },

    footer: {
        marginTop: 24,
        fontSize: 11,
        color: '#9ca3af',
        textAlign: 'center',
        lineHeight: 16,
    },

    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#d1d5db',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    googleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
})

