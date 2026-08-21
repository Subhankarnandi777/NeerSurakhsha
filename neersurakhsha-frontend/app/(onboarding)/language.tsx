import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const LANGUAGES = [
  { id: 'en', native: 'English', english: 'English' },
  { id: 'hi', native: 'हिन्दी', english: 'Hindi' },
  { id: 'as', native: 'অসমীয়া', english: 'Assamese' },
  { id: 'brx', native: 'बर\'', english: 'Bodo' },
  { id: 'kha', native: 'Khasi', english: 'Khasi' },
  { id: 'lus', native: 'Mizo ṭawng', english: 'Mizo' },
  { id: 'mni', native: 'ꯃꯤꯇꯩꯂꯣꯟ', english: 'Manipuri' }
];

export default function LanguageSelect() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      {/* TopAppBar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="emergency" size={24} color={colors.primary} />
          <Text style={styles.brandText}>NEERSURAKSHA</Text>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <MaterialIcons name="call" size={16} color={colors.primary} />
          <Text style={styles.callBtnText}>CALL FOR HELP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.textCenter}>
          <Text style={styles.title}>Select your preferred language</Text>
          <Text style={styles.subtitle}>अपनी पसंदीदा भाषा चुनें</Text>
        </View>

        <ScrollView contentContainerStyle={styles.grid}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <TouchableOpacity 
                key={lang.id}
                style={[
                  styles.card, 
                  isSelected ? styles.cardSelected : styles.cardDefault
                ]}
                onPress={() => setSelectedLang(lang.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.langNative}>{lang.native}</Text>
                <Text style={styles.langEnglish}>{lang.english}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.continueBtn,
              !selectedLang && styles.continueBtnDisabled
            ]}
            disabled={!selectedLang}
            onPress={() => router.push('/(onboarding)/login')}
          >
            <Text style={styles.continueText}>CONTINUE</Text>
            <MaterialIcons name="arrow-forward" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.edgeMargin,
    height: 56,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(22, 40, 57, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    ...typography.h3,
    fontSize: 16,
    color: colors.primary,
    letterSpacing: 1,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  callBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.primary,
  },
  container: {
    flex: 1,
    paddingTop: 32,
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: spacing.edgeMargin,
  },
  title: {
    ...typography.h2,
    fontSize: 24,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.h3,
    fontSize: 20,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.edgeMargin,
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: 8,
    padding: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardDefault: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  cardSelected: {
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  langNative: {
    ...typography.h3,
    fontSize: 20,
    color: colors.primary,
    marginBottom: 4,
  },
  langEnglish: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
  },
  footer: {
    padding: spacing.edgeMargin,
    paddingBottom: 32,
    marginTop: 'auto',
  },
  continueBtn: {
    backgroundColor: colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 12,
  },
  continueBtnDisabled: {
    opacity: 0.5,
  },
  continueText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: colors.onPrimary,
    letterSpacing: 1,
  }
});
