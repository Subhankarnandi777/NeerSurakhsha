import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store/main.store';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { userRole, userName, userPhone, villageName } = useAppStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const handleLogout = () => {
    // Navigate back to login
    router.replace('/(onboarding)/login');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Profile</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, isTablet && { maxWidth: 600, alignSelf: 'center', width: '100%' }]} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userRole}</Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <View style={styles.detailBox}>
            <View style={styles.detailRow}>
              <MaterialIcons name="call" size={20} color={colors.onSurfaceVariant} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Registered Mobile</Text>
                <Text style={styles.detailValue}>{userPhone}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <MaterialIcons name="location-on" size={20} color={colors.onSurfaceVariant} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Assigned Region</Text>
                <Text style={styles.detailValue}>{villageName}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="security" size={24} color={colors.primary} />
            <Text style={styles.actionBtnText}>Change PIN</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialIcons name="g-translate" size={24} color={colors.primary} />
            <Text style={styles.actionBtnText}>Change Language</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={colors.error} />
          <Text style={styles.logoutBtnText}>LOG OUT</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.edgeMargin,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(22, 40, 57, 0.1)',
  },
  headerTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.edgeMargin,
    paddingBottom: 100, // accommodate tab bar
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 32,
    color: colors.onPrimaryContainer,
  },
  userName: {
    ...typography.h2,
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: colors.tertiaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.tertiary,
  },
  roleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.onTertiaryContainer,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primary,
    marginBottom: 16,
  },
  detailBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(22, 40, 57, 0.1)',
    marginVertical: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  actionBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
    flex: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorContainer,
    padding: 16,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 1,
    color: colors.error,
  }
});
