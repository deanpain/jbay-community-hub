import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { pilotJeffreysBayListings, pilotJeffreysBaySample } from "@jbay/config";
import { listingsForCategory, type HubTab, type Listing } from "@jbay/shared";
import { colors } from "@jbay/ui-tokens";

const TAB_ORDER: HubTab[] = ["education", "recreation", "entertainment"];

export default function App() {
  const [tab, setTab] = useState<HubTab>("education");
  const [detail, setDetail] = useState<Listing | null>(null);

  const pilotName = pilotJeffreysBaySample.displayName;

  const tabAvailability = useMemo(
    () => ({
      education: pilotJeffreysBaySample.tabs.education.enabled,
      recreation: pilotJeffreysBaySample.tabs.recreation.enabled,
      entertainment: pilotJeffreysBaySample.tabs.entertainment.enabled,
    }),
    [],
  );

  const visibleListings = useMemo(
    () => listingsForCategory(pilotJeffreysBayListings, tab),
    [tab],
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
              onPress={() => {
                setTab(key);
                setDetail(null);
              }}
              style={[styles.tab, active && styles.tabActive, !enabled && styles.tabDisabled]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{key}</Text>
            </Pressable>
          );
        })}
      </View>

      {detail ? (
        <ScrollView contentContainerStyle={styles.body}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to listings"
            onPress={() => setDetail(null)}
            style={styles.backRow}
          >
            <Text style={styles.backText}>← Listings</Text>
          </Pressable>
          <Text style={styles.detailTitle}>{detail.title}</Text>
          <Text style={styles.orgLine}>{detail.partner.displayName}</Text>
          <Text style={styles.bodyText}>{detail.summary}</Text>
          {detail.schedule ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Schedule</Text>
              <Text style={styles.bodyText}>{detail.schedule}</Text>
            </View>
          ) : null}
          {detail.proofRequirements ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>Proof & credentials</Text>
              <Text style={styles.bodyText}>{detail.proofRequirements}</Text>
            </View>
          ) : null}
          <Text style={styles.stubNote}>
            Shielded on-chain payloads and Lace connect land with Compact bindings — this screen is
            mock MLS against shared types.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={visibleListings}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.bodyText}>
              No listings in this tab yet — add seed data or enable the tab in municipality config.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityHint="Opens listing details"
              onPress={() => setDetail(item)}
              style={styles.card}
            >
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.orgLine}>{item.partner.displayName}</Text>
              <Text style={styles.cardSummary} numberOfLines={3}>
                {item.summary}
              </Text>
            </Pressable>
          )}
        />
      )}
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
  listContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 32,
  },
  body: {
    padding: 20,
    gap: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surface,
    gap: 6,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
  },
  cardSummary: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  orgLine: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  backRow: {
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  backText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  detailTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  bodyText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  block: {
    gap: 4,
  },
  blockLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  stubNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    fontStyle: "italic",
  },
});
