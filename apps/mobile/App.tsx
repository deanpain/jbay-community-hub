import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { pilotJeffreysBaySample } from "@jbay/config";
import {
  listingsForCategory,
  pilotJeffreysBayListings,
  type HubTab,
  type Listing,
} from "@jbay/shared";
import { colors } from "@jbay/ui-tokens";

import { ListingDraftModal } from "./src/components/ListingDraftModal";
import { loadDraftListings, saveDraftListings } from "./src/lib/listingDraftsStorage";
import { strings } from "./src/i18n";

const TAB_ORDER: HubTab[] = ["education", "recreation", "entertainment"];

export default function App() {
  const [tab, setTab] = useState<HubTab>("education");
  const [detail, setDetail] = useState<Listing | null>(null);
  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [draftsHydrated, setDraftsHydrated] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<Listing | null>(null);

  const pilotName = pilotJeffreysBaySample.displayName;

  const tabAvailability = useMemo(
    () => ({
      education: pilotJeffreysBaySample.tabs.education.enabled,
      recreation: pilotJeffreysBaySample.tabs.recreation.enabled,
      entertainment: pilotJeffreysBaySample.tabs.entertainment.enabled,
    }),
    [],
  );

  useEffect(() => {
    void loadDraftListings().then((loaded) => {
      setDrafts(loaded);
      setDraftsHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!draftsHydrated) return;
    void saveDraftListings(drafts);
  }, [drafts, draftsHydrated]);

  const visibleListings = useMemo(() => {
    const seed = listingsForCategory(pilotJeffreysBayListings, tab);
    const local = listingsForCategory(drafts, tab);
    return [...local, ...seed];
  }, [tab, drafts]);

  const openCreateDraft = useCallback(() => {
    setFormInitial(null);
    setFormOpen(true);
  }, []);

  const openEditDraft = useCallback((listing: Listing) => {
    setFormInitial(listing);
    setFormOpen(true);
  }, []);

  const onSaveDraft = useCallback((listing: Listing) => {
    setDrafts((prev) => {
      const without = prev.filter((x) => x.id !== listing.id);
      return [...without, listing];
    });
    setDetail((d) => (d?.id === listing.id ? listing : d));
  }, []);

  const confirmDeleteDraft = useCallback((id: string) => {
    Alert.alert(strings.draftDeleteConfirmTitle, strings.draftDeleteConfirmMessage, [
      { text: strings.draftDeleteConfirmCancel, style: "cancel" },
      {
        text: strings.draftDeleteConfirmOk,
        style: "destructive",
        onPress: () => {
          setDrafts((prev) => prev.filter((x) => x.id !== id));
          setDetail((d) => (d?.id === id ? null : d));
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.headerMain}>
          <Text style={styles.title}>{pilotName}</Text>
          <Text style={styles.subtitle}>{strings.hubTagline}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.a11yWalletChip}
          hitSlop={12}
          onPress={() =>
            Alert.alert(strings.walletPlaceholderTitle, strings.walletPlaceholderBody)
          }
          style={styles.walletChip}
        >
          <Text style={styles.walletChipText}>{strings.walletChipLabel}</Text>
        </Pressable>
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
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {strings.tabs[key]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {detail ? (
        <ScrollView contentContainerStyle={styles.body}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.a11yBackToListings}
            onPress={() => setDetail(null)}
            style={styles.backRow}
          >
            <Text style={styles.backText}>{strings.backToListings}</Text>
          </Pressable>
          {detail.source === "draft" ? (
            <Text style={styles.draftBadge}>{strings.draftBadge}</Text>
          ) : null}
          <Text style={styles.detailTitle}>{detail.title}</Text>
          <Text style={styles.orgLine}>{detail.partner.displayName}</Text>
          <Text style={styles.bodyText}>{detail.summary}</Text>
          {detail.schedule ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>{strings.scheduleHeading}</Text>
              <Text style={styles.bodyText}>{detail.schedule}</Text>
            </View>
          ) : null}
          {detail.proofRequirements ? (
            <View style={styles.block}>
              <Text style={styles.blockLabel}>{strings.proofHeading}</Text>
              <Text style={styles.bodyText}>{detail.proofRequirements}</Text>
            </View>
          ) : null}
          {detail.source === "draft" ? (
            <View style={styles.draftActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => openEditDraft(detail)}
                style={[styles.draftBtn, styles.draftBtnPrimary]}
              >
                <Text style={styles.draftBtnPrimaryText}>{strings.draftEdit}</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => confirmDeleteDraft(detail.id)}
                style={[styles.draftBtn, styles.draftBtnDanger]}
              >
                <Text style={styles.draftBtnDangerText}>{strings.draftDelete}</Text>
              </Pressable>
            </View>
          ) : null}
          <Text style={styles.stubNote}>{strings.detailStubNote}</Text>
        </ScrollView>
      ) : (
        <View style={styles.listWrap}>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={visibleListings}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.bodyText}>{strings.emptyTab}</Text>
            }
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityHint={strings.a11yOpenListing}
                onPress={() => setDetail(item)}
                style={styles.card}
              >
                {item.source === "draft" ? (
                  <Text style={styles.cardDraftTag}>{strings.draftBadge}</Text>
                ) : null}
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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.a11yAddListing}
            onPress={openCreateDraft}
            style={styles.fab}
          >
            <Text style={styles.fabPlus}>+</Text>
            <Text style={styles.fabLabel}>{strings.listingAdd}</Text>
          </Pressable>
        </View>
      )}

      <ListingDraftModal
        defaultCategory={tab}
        initial={formInitial}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
        }}
        onSave={onSaveDraft}
        visible={formOpen}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerMain: {
    flex: 1,
    minWidth: 0,
  },
  walletChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
  },
  walletChipText: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 14,
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
  listWrap: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 12,
    paddingBottom: 100,
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
  cardDraftTag: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontWeight: "700",
    color: colors.background,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
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
  draftBadge: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "700",
    color: colors.background,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
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
  draftActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  draftBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  draftBtnPrimary: {
    backgroundColor: colors.accent,
  },
  draftBtnPrimaryText: {
    color: colors.background,
    fontWeight: "700",
  },
  draftBtnDanger: {
    borderWidth: 1,
    borderColor: "#f87171",
  },
  draftBtnDangerText: {
    color: "#f87171",
    fontWeight: "700",
  },
  stubNote: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    fontStyle: "italic",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  fabPlus: {
    color: colors.background,
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 24,
  },
  fabLabel: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 15,
  },
});
