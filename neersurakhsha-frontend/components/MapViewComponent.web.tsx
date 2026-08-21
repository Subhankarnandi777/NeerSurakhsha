import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export default function MapViewComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map is only available on the mobile app.</Text>
      <Text style={styles.subtext}>Please scan the QR code with Expo Go to view the interactive map.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  text: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  }
});
