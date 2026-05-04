import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { HubTab, Listing } from "@jbay/shared";
import { colors } from "@jbay/ui-tokens";

import { strings } from "../i18n";

export type DraftFormValues = {
  readonly title: string;
  readonly summary: string;
  readonly category: HubTab;
  readonly organisation: string;
};

const TABS: HubTab[] = ["education", "recreation", "entertainment"];

function slugOrg(name: string): string {
  const t = name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return t.length > 0 ? t : "local-draft";
}

function newDraftId(): string {
  return `draft_${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function buildDraftListing(values: DraftFormValues, existingId?: string): Listing {
  const id = existingId ?? newDraftId();
  const org = values.organisation.trim() || strings.draftDefaultOrganisation;
  return {
    id,
    category: values.category,
    title: values.title.trim(),
    summary: values.summary.trim(),
    partner: { id: slugOrg(org), displayName: org },
    source: "draft",
  };
}

type Props = {
  readonly visible: boolean;
  readonly initial: Listing | null;
  readonly defaultCategory: HubTab;
  readonly onClose: () => void;
  readonly onSave: (listing: Listing) => void;
};

export function ListingDraftModal({
  visible,
  initial,
  defaultCategory,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [category, setCategory] = useState<HubTab>(defaultCategory);

  useEffect(() => {
    if (!visible) return;
    if (initial) {
      setTitle(initial.title);
      setSummary(initial.summary);
      setOrganisation(initial.partner.displayName);
      setCategory(initial.category);
    } else {
      setTitle("");
      setSummary("");
      setOrganisation("");
      setCategory(defaultCategory);
    }
  }, [visible, initial, defaultCategory]);

  const save = () => {
    const t = title.trim();
    const s = summary.trim();
    if (!t || !s) return;
    const listing = buildDraftListing(
      { title: t, summary: s, category, organisation: organisation.trim() },
      initial?.source === "draft" ? initial.id : undefined,
    );
    onSave(listing);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>
            {initial ? strings.draftEditTitle : strings.draftNewTitle}
          </Text>

          <Text style={styles.label}>{strings.draftFieldOrganisation}</Text>
          <TextInput
            accessibilityLabel={strings.draftFieldOrganisation}
            onChangeText={setOrganisation}
            placeholder={strings.draftOrgPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={organisation}
          />

          <Text style={styles.label}>{strings.draftFieldTitle}</Text>
          <TextInput
            accessibilityLabel={strings.draftFieldTitle}
            onChangeText={setTitle}
            placeholder={strings.draftTitlePlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={title}
          />

          <Text style={styles.label}>{strings.draftFieldSummary}</Text>
          <TextInput
            accessibilityLabel={strings.draftFieldSummary}
            multiline
            numberOfLines={4}
            onChangeText={setSummary}
            placeholder={strings.draftSummaryPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.inputMultiline]}
            value={summary}
          />

          <Text style={styles.label}>{strings.draftFieldCategory}</Text>
          <View style={styles.tabRow}>
            {TABS.map((key) => {
              const active = category === key;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  key={key}
                  onPress={() => setCategory(key)}
                  style={[styles.tabMini, active && styles.tabMiniActive]}
                >
                  <Text style={[styles.tabMiniLabel, active && styles.tabMiniLabelActive]}>
                    {strings.tabs[key]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={[styles.btn, styles.btnGhost]}
            >
              <Text style={styles.btnGhostText}>{strings.draftCancel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={!title.trim() || !summary.trim()}
              onPress={save}
              style={[styles.btn, styles.btnPrimary, (!title.trim() || !summary.trim()) && styles.btnDisabled]}
            >
              <Text style={styles.btnPrimaryText}>{strings.draftSave}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 28,
    borderWidth: 1,
    borderColor: colors.surface,
    gap: 8,
  },
  sheetTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  tabMini: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surface,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  tabMiniActive: {
    borderColor: colors.accent,
  },
  tabMiniLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },
  tabMiniLabelActive: {
    color: colors.accent,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: colors.surface,
  },
  btnGhostText: {
    color: colors.textMuted,
    fontWeight: "600",
  },
  btnPrimary: {
    backgroundColor: colors.accent,
  },
  btnPrimaryText: {
    color: colors.background,
    fontWeight: "700",
  },
  btnDisabled: {
    opacity: 0.4,
  },
});
