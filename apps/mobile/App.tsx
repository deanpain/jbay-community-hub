import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { pilotJeffreysBaySample } from "@jbay/config";
import type { HubTab } from "@jbay/shared";
import { colors } from "@jbay/ui-tokens";

const TAB_ORDER: HubTab[] = ["education", "recreation", "entertainment"];

export default function App() {
  const [tab, setTab] = useState<HubTab>("education");

  const pilotName = pilotJeffreysBaySample.displayName;

  const tabAvailability = useMemo(
    () => ({
      education: pilotJeffreysBaySample.tabs.education.enabled,
      recreation: pilotJeffreysBaySample.tabs.recreation.enabled,
      entertainment: pilotJeffreysBaySample.tabs.entertainment.enabled,
    }),
    [],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>{pilotName}</Text>
        <Text style={styles.subtitle}>Education · Recreation · Entertainment</Text>
      </View>

      <View style={styles.tabs}>
        {TAB_ORDER.map((key) => {
          const enabled = tabAvailability[key];
          const active = tab === key;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active, disabled: !enabled }}
              disabled={!enabled}
              key={key}
              onPress={() => setTab(key)}
              style={[styles.tab, active && styles.tabActive, !enabled && styles.tabDisabled]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{key}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.sectionTitle}>Private MLS scaffold</Text>
        <Text style={styles.bodyText}>
          {`Tab "${tab}" will host shielded listings once Midnight Compact bindings land. Wallet connect (Lace) wires in during Phase 1 milestones — confirm RN bindings against the latest Lace SDK guidance.`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
  },
  tabActive: {
    borderColor: colors.accent,
  },
  tabDisabled: {
    opacity: 0.35,
  },
  tabLabel: {
    color: colors.textMuted,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  tabLabelActive: {
    color: colors.accent,
  },
  body: {
    padding: 20,
    gap: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  bodyText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
