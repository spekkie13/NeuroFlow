import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 8 },
    googleButton: { marginBottom: 16 },
    errorText: { color: '#b91c1c', marginBottom: 8 },
    submitButton: { backgroundColor: '#2563eb', borderRadius: 8, padding: 12, alignItems: 'center' },
    submitDisabled: { backgroundColor: '#93c5fd' },
    submitText: { color: 'white', fontWeight: '600' },
})
