import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAppStore } from '../../store/main.store';
import { HealthCase } from '../../types/health';

const SYMPTOMS = [
  'Diarrhoea', 'Vomiting', 'Fever', 'Stomach pain', 'Jaundice', 'Other'
];

export default function HealthReport() {
  const router = useRouter();
  const { villageName, addHealthCase, sources } = useAppStore();
  
  const [householdId, setHouseholdId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  // Automatically select the first real source ID from the database to prevent Foreign Key errors
  const [sourceId, setSourceId] = useState(sources.length > 0 ? sources[0].id : '');

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = () => {
    const newCase: HealthCase = {
      id: Math.random().toString(36).substr(2, 9),
      householdId,
      patientName,
      age: 25,
      gender: 'Other',
      village: villageName,
      date: new Date().toISOString(),
      symptoms: selectedSymptoms,
      severity: 'Moderate',
      sourceId,
      notes: '',
      synced: false
    };
    addHealthCase(newCase);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Health Case</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.card, styles.hcBorder]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Patient Details</Text>
            </View>
            
            <TextInput 
              style={[styles.input, styles.hcBorderSecondary]} 
              placeholder="Household ID (e.g., H-102)"
              placeholderTextColor={colors.outline}
              value={householdId}
              onChangeText={setHouseholdId}
            />
            <TextInput 
              style={[styles.input, styles.hcBorderSecondary]} 
              placeholder="Patient Name (Optional)"
              placeholderTextColor={colors.outline}
              value={patientName}
              onChangeText={setPatientName}
            />
          </View>

          <View style={[styles.card, styles.hcBorder]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="coronavirus" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Symptoms</Text>
            </View>
            <View style={styles.symptomsGrid}>
              {SYMPTOMS.map(s => (
                <TouchableOpacity 
                  key={s} 
                  style={[
                    styles.symptomChip, 
                    selectedSymptoms.includes(s) ? styles.symptomChipActive : styles.symptomChipInactive,
                  ]}
                  onPress={() => toggleSymptom(s)}
                >
                  <Text style={[
                    styles.symptomText,
                    selectedSymptoms.includes(s) && styles.symptomTextActive
                  ]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.card, styles.hcBorder]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="water-drop" size={24} color={colors.primary} />
              <Text style={styles.sectionTitle}>Primary Water Source</Text>
            </View>
            <Text style={styles.caption}>Critical: Every health report must link to a water source.</Text>
            
            <TouchableOpacity 
              style={[styles.sourceSelector, styles.hcBorderPrimary, styles.hcShadowPrimary]}
              onPress={() => router.push('/health-report/select-source')}
            >
              <MaterialIcons name="water" size={24} color={colors.primary} />
              <Text style={styles.sourceName}>{sources.find(s => s.id === sourceId)?.name || 'Select Source'}</Text>
              <MaterialIcons name="chevron-right" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.submitBtn, styles.hcShadowDark]} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>SUBMIT & LINK SOURCE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.edgeMargin,
    height: 56,
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(22, 40, 57, 0.1)',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.primary,
    fontSize: 20,
  },
  content: {
    padding: spacing.edgeMargin,
    paddingBottom: spacing.xl,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: 20,
    borderRadius: 8,
  },
  hcBorder: {
    borderWidth: 2,
    borderColor: 'rgba(22, 40, 57, 0.2)', // Soft border for cards
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.primary,
  },
  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurface,
  },
  hcBorderSecondary: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 2,
  },
  symptomChipInactive: {
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
  },
  symptomChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondaryContainer,
  },
  symptomText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  symptomTextActive: {
    color: colors.onSecondary,
  },
  caption: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.error,
    marginBottom: 16,
    backgroundColor: 'rgba(186, 26, 26, 0.1)',
    padding: 8,
    borderRadius: 4,
  },
  sourceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primaryFixed,
    borderRadius: 8,
  },
  hcBorderPrimary: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  hcShadowPrimary: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  sourceName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: colors.primary,
    flex: 1,
    marginLeft: 12,
  },
  footer: {
    padding: spacing.edgeMargin,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 2,
    borderTopColor: 'rgba(22, 40, 57, 0.1)',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hcShadowDark: {
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    letterSpacing: 1,
    color: colors.onPrimary,
  }
});
