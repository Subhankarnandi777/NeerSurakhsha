import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store/main.store';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function SafeWaterMap() {
  const { sources } = useAppStore();
  const router = useRouter();

  // Selected source for the routing card (simulated for UI)
  const [selectedSource, setSelectedSource] = useState(sources[0]);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="emergency" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NEERSURAKSHA</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>CALL FOR HELP</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 26.2,
            longitude: 91.7,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {sources.map(source => {
            const isSafe = source.status === 'SAFE';
            return (
              <Marker
                key={source.id}
                coordinate={{ latitude: source.lat, longitude: source.lng }}
                onPress={() => setSelectedSource(source)}
              >
                <View style={styles.markerContainer}>
                  <View style={[
                    styles.markerIcon,
                    isSafe ? styles.markerSafe : styles.markerAlert,
                    isSafe ? styles.hcBorder : styles.markerAlertBorder
                  ]}>
                    <MaterialIcons 
                      name={isSafe ? "water-drop" : "warning"} 
                      size={20} 
                      color={isSafe ? colors.onTertiary : colors.onError} 
                    />
                  </View>
                  <View style={[styles.markerLabel, isSafe ? styles.hcBorder : styles.markerAlertLabelBorder]}>
                    <Text style={[styles.markerLabelText, isSafe ? { color: colors.primary } : { color: colors.error }]}>
                      {source.name} - {isSafe ? 'Safe' : 'Contaminated'}
                    </Text>
                  </View>
                </View>
              </Marker>
            );
          })}

          {/* User Location Marker (Simulated) */}
          <Marker coordinate={{ latitude: 26.18, longitude: 91.72 }}>
            <View style={styles.userLocationOuter}>
              <View style={styles.userLocationInner} />
            </View>
          </Marker>

          {/* Simulated Route Path if a source is selected */}
          {selectedSource && (
            <Polyline
              coordinates={[
                { latitude: 26.18, longitude: 91.72 },
                { latitude: selectedSource.lat, longitude: selectedSource.lng }
              ]}
              strokeColor={colors.secondary}
              strokeWidth={4}
              lineDashPattern={[8, 4]}
            />
          )}
        </MapView>

        {/* Legend & Quick Info */}
        <View style={styles.legendContainer}>
          <View style={[styles.legendBox, styles.hcBorder]}>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDotSafe, styles.hcBorder]} />
                <Text style={styles.legendText}>Safe</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotAlert} />
                <Text style={styles.legendText}>Alert</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.locationButton, styles.hcBorder]}>
              <MaterialIcons name="my-location" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.fabContainer}>
          <TouchableOpacity style={[styles.fab, styles.hcBorder, styles.hcShadow]}>
            <MaterialIcons name="mic" size={32} color={colors.onSecondary} />
          </TouchableOpacity>
        </View>

        {/* Active Routing Card */}
        {selectedSource && (
          <View style={styles.routingCardContainer}>
            <View style={[styles.routingCard, styles.hcBorder, styles.hcShadow]}>
              <View style={styles.routingHeader}>
                <View>
                  <Text style={styles.routingTitle}>{selectedSource.name}</Text>
                  <Text style={styles.routingSubtitle}>{selectedSource.type.replace('_', ' ')}</Text>
                </View>
                {selectedSource.status === 'SAFE' ? (
                  <View style={[styles.statusBadgeSafe, styles.hcBorder]}>
                    <MaterialIcons name="check-circle" size={16} color={colors.onTertiary} />
                    <Text style={styles.statusBadgeSafeText}>SAFE</Text>
                  </View>
                ) : (
                  <View style={[styles.statusBadgeAlert, { borderColor: colors.error }]}>
                    <MaterialIcons name="warning" size={16} color={colors.error} />
                    <Text style={styles.statusBadgeAlertText}>ALERT</Text>
                  </View>
                )}
              </View>

              <View style={styles.routingBody}>
                <View style={styles.routingStats}>
                  <Text style={styles.distanceText}>1.2<Text style={styles.distanceUnit}>km</Text></Text>
                  <Text style={styles.timeText}>EST. 15 MIN WALK</Text>
                </View>
                <TouchableOpacity style={[styles.routeButton, styles.hcBorder, styles.hcShadow]}>
                  <MaterialIcons name="directions-walk" size={24} color={colors.onSecondary} />
                  <Text style={styles.routeButtonText}>START ROUTE</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(22, 40, 57, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.edgeMargin,
    height: 56,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  helpButton: {
    borderWidth: 2,
    borderColor: 'rgba(22, 40, 57, 0.2)',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  helpButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.primary,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  hcBorder: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  hcShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  markerSafe: {
    backgroundColor: colors.tertiary,
  },
  markerAlert: {
    backgroundColor: colors.error,
  },
  markerAlertBorder: {
    borderWidth: 2,
    borderColor: colors.errorContainer,
    shadowColor: colors.error,
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  markerLabel: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 2,
  },
  markerAlertLabelBorder: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  markerLabelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  userLocationOuter: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(252, 113, 39, 0.3)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userLocationInner: {
    width: 8,
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
  },
  legendContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  legendBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDotSafe: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.tertiary,
  },
  legendDotAlert: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
    borderWidth: 1,
    borderColor: colors.onError,
  },
  legendText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  locationButton: {
    backgroundColor: colors.surfaceContainer,
    padding: 8,
    borderRadius: 6,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 200,
    right: 16,
    zIndex: 30,
  },
  fab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routingCardContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  routingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  routingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 2,
    borderBottomColor: colors.surfaceVariant,
    paddingBottom: 8,
    marginBottom: 8,
  },
  routingTitle: {
    ...typography.h3,
    color: colors.primary,
    fontSize: 24,
  },
  routingSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  statusBadgeSafe: {
    backgroundColor: colors.tertiary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
  },
  statusBadgeSafeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onTertiary,
  },
  statusBadgeAlert: {
    backgroundColor: colors.errorContainer,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 2,
  },
  statusBadgeAlertText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.error,
  },
  routingBody: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  routingStats: {
    flex: 1,
    justifyContent: 'center',
  },
  distanceText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 48,
    lineHeight: 52,
    color: colors.primary,
    letterSpacing: -1,
  },
  distanceUnit: {
    fontSize: 24,
  },
  timeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  routeButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  routeButtonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onSecondary,
    marginTop: 4,
    letterSpacing: 1,
  },
});

// A slightly muted map style for civic clarity
const mapStyle = [
  {
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "weight": "2.00"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#9c9c9c"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f2f2f2"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7b7b7b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "color": "#46bcec"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c8d7d4"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#070707"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }
];
