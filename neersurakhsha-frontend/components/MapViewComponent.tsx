import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius, elevation } from '../theme/spacing';
import { useAppStore } from '../store/main.store';
import { useRouter } from 'expo-router';

export default function MapViewComponent() {
  const { sources } = useAppStore();
  const router = useRouter();

  const getMarkerColor = (status: string) => {
    switch(status) {
      case 'SAFE': return colors.status.safe;
      case 'CONTAMINATION_RISK': return colors.status.warning;
      case 'AVAILABILITY_RISK': return colors.status.warning;
      case 'HIGH_RISK': return colors.status.danger;
      default: return colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 26.2,
          longitude: 91.7,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {sources.map(source => (
          <Marker
            key={source.id}
            coordinate={{ latitude: source.lat, longitude: source.lng }}
            pinColor={getMarkerColor(source.status)}
          >
            <Callout onPress={() => router.push(`/source/${source.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{source.name}</Text>
                <Text style={styles.calloutSubtitle}>{source.status.replace('_', ' ')}</Text>
                <Text style={styles.calloutAction}>Tap for details</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={[styles.legend, elevation.level1]}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.status.safe }]} />
          <Text style={styles.legendText}>Safe</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.status.warning }]} />
          <Text style={styles.legendText}>Alert</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.status.danger }]} />
          <Text style={styles.legendText}>Emergency</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: spacing.base,
    alignItems: 'center',
    minWidth: 140,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.default,
  },
  calloutTitle: {
    ...typography.subtitle,
    color: colors.onSurface,
  },
  calloutSubtitle: {
    ...typography.caption,
    color: colors.onSurfaceVariant,
    marginVertical: spacing.xs,
  },
  calloutAction: {
    ...typography.small,
    color: colors.primary,
    fontWeight: 'bold',
  },
  legend: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.edgeMargin,
    right: spacing.edgeMargin,
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.md,
    borderRadius: radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: colors.outline,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
  },
  legendText: {
    ...typography.body,
    color: colors.onSurface,
  }
});
