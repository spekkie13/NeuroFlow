import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    overlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        zIndex: 500,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },
    addProjectBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 9999,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    addProjectBtnText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 13,
    },
    headerBlock: {
        position: 'relative',
        zIndex: 100, // dropdown boven alles
    },
    inputBlock: {
        position: 'relative',
        zIndex: 1,
    },
    focusBanner: {
        backgroundColor: '#EFF6FF',
        borderColor: '#DBEAFE',
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        marginBottom: 8,
        gap: 4,
    },
    focusTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1D4ED8',
    },
    focusText: {
        fontSize: 12,
        color: '#1F2937',
    },
    focusCurrent: {
        fontSize: 12,
        color: '#1F2937',
    },
    focusCurrentName: {
        fontWeight: '600',
    },
    focusExitBtn: {
        alignSelf: 'flex-start',
        marginTop: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 9999,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    focusExitText: {
        fontSize: 12,
        color: '#1D4ED8',
        fontWeight: '600',
    },
});
