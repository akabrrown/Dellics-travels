import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export function Button({ title, onPress, loading, variant = 'primary' }: any) {
  const isPrimary = variant === 'primary';
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.secondary]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color={isPrimary ? '#FFF' : '#F4740D'} /> : (
        <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textSecondary]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { padding: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#F4740D' },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#F4740D' },
  text: { fontSize: 16, fontWeight: 'bold' },
  textPrimary: { color: '#FFFFFF' },
  textSecondary: { color: '#F4740D' },
});
