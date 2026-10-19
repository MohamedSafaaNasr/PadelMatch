
import React, { useReducer, useRef } from "react";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

const COLORS = {
  background: "#F7F9F6",
  lime: "#D8FF36",
  darkGreen: "#173D2F",
  dark: "#14201B",
  coral: "#FF684F",
  muted: "#708078",
  border: "#DCE4DE",
  white: "#FFFFFF",
};

const INITIAL_PLAYERS = [
  { name: "Team 1", initials: "T1", color: "#E0ECE4" },
  { name: "Team 2", initials: "T2", color: "#FFE4DD" },
];

const createInitialPlayers = () =>
  INITIAL_PLAYERS.map((player) => ({
    ...player,
    score: 0,
    games: 0,
    sets: 0,
  }));

const initialMatchState = {
  players: createInitialPlayers(),
  matchFinished: false,
};

function matchReducer(state, action) {
  if (action.type === "reset") {
    return {
      players: createInitialPlayers(),
      matchFinished: false,
    };
  }

  if (action.type !== "addPoint" || state.matchFinished) {
    return state;
  }

  const { playerIndex } = action;
  if (playerIndex !== 0 && playerIndex !== 1) {
    return state;
  }

  const players = state.players.map((player) => ({ ...player }));
  const opponentIndex = playerIndex === 0 ? 1 : 0;
  const player = players[playerIndex];
  const opponent = players[opponentIndex];
  const isTieBreak = players[0].games === 6 && players[1].games === 6;

  player.score += 1;

  const pointTarget = isTieBreak ? 7 : 4;
  if (
    player.score < pointTarget ||
    player.score - opponent.score < 2
  ) {
    return { ...state, players };
  }

  player.games += 1;
  player.score = 0;
  opponent.score = 0;

  const setWon =
    isTieBreak ||
    (player.games >= 6 && player.games - opponent.games >= 2);

  if (!setWon) {
    return { ...state, players };
  }

  player.sets += 1;
  player.games = 0;
  opponent.games = 0;

  return {
    players,
    matchFinished: player.sets >= 2,
  };
}

const getDisplayedScore = (players, playerIndex) => {
  const player = players[playerIndex];
  const opponent = players[playerIndex === 0 ? 1 : 0];
  const isTieBreak = players[0].games === 6 && players[1].games === 6;

  if (isTieBreak) {
    return String(player.score);
  }

  if (player.score >= 3 && opponent.score >= 3) {
    if (player.score === opponent.score) return "40";
    return player.score > opponent.score ? "AD" : "40";
  }

  return ["Love", "15", "30", "40"][player.score];
};

export default function MatchScreen() {
  const { width } = useWindowDimensions();
  const scoreboardRef = useRef(null);

  const [match, dispatch] = useReducer(matchReducer, initialMatchState);
  const { players, matchFinished } = match;
  const setNumber = players[0].sets + players[1].sets + 1;
  const isTieBreak = players[0].games === 6 && players[1].games === 6;
  const resetMatch = () => dispatch({ type: "reset" });
  const addPoint = (playerIndex) =>
    dispatch({ type: "addPoint", playerIndex });

  const gamesText = `${players[0].games}–${players[1].games}`;
  const shareMatch = async () => {
    if (!scoreboardRef.current) {
      Alert.alert(
        "Unable to share match image",
        "The scoreboard is not ready."
      );
      return;
    }

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert(
          "Sharing unavailable",
          "Image sharing is not available on this device."
        );
        return;
      }

      const imageUri = await captureRef(scoreboardRef, {
        format: "png",
        quality: 1,
      });
      await Sharing.shareAsync(imageUri, {
        mimeType: "image/png",
        dialogTitle: "Share match score",
        UTI: "public.png",
      });
    } catch (error) {
      Alert.alert(
        "Unable to share match image",
        error instanceof Error ? error.message : "Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons
          name="tennisball-outline"
          size={30}
          color={COLORS.black}
        />
            </View>
            <Text style={styles.brandName}>PADEL MATCH</Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Share match score"
            style={styles.shareButton}
            onPress={shareMatch}
          >
            <Ionicons name="share-outline" size={23} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        <View
          ref={scoreboardRef}
          collapsable={false}
          style={styles.scoreboardCapture}
        >
        {/* Match title */}
        <View style={styles.titleSection}>
          <Text style={styles.eyebrow}>MATCH COUNTER</Text>

          <View style={styles.titleRow}>
            <Text style={styles.matchTitle}>Friendly match</Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetMatch}
              activeOpacity={0.7}
            >
              <Text style={styles.resetIcon}>↻</Text>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.matchInfoRow}>
            <Text style={styles.matchInfo}>
              {isTieBreak
                ? "Tie-break · first to 7 by 2"
                : `Set ${setNumber} · Best of 3`}
            </Text>
          </View>
        </View>

        {/* Player cards */}
        <View
          style={[
            styles.playersContainer,
            width < 360 && styles.playersContainerSmall,
          ]}
        >
          {players.map((player, index) => (
            <View
              key={player.initials}
              style={[
                styles.playerCard,
                index === 0 && styles.firstCard,
              ]}
            >
              {/* Player name */}
              <View style={styles.playerHeader}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: player.color },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarText,
                      { color: index === 0 ? COLORS.darkGreen : "#A83D30" },
                    ]}
                  >
                    {player.initials}
                  </Text>
                </View>

                <Text
                  style={styles.playerName}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {player.name}
                </Text>
              </View>

              {/* Score */}
              <View style={styles.scoreContainer}>
                <Text
                  style={[
                    styles.score,
                    {
                      color:
                        index === 0 ? COLORS.dark : COLORS.coral,
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {getDisplayedScore(players, index)}
                </Text>
              </View>

              {/* Games and sets */}
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>GAMES</Text>
                  <Text style={styles.statValue}>{player.games}</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.stat}>
                  <Text style={styles.statLabel}>SETS</Text>
                  <Text style={styles.statValue}>{player.sets}</Text>
                </View>
              </View>

              {/* Add point */}
              <TouchableOpacity
                style={[
                  styles.addButton,
                  index === 0
                    ? styles.darkAddButton
                    : styles.limeAddButton,
                ]}
                onPress={() => addPoint(index)}
                disabled={matchFinished}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.addButtonText,
                    index === 0
                      ? styles.whiteText
                      : styles.darkButtonText,
                  ]}
                >
                  <Text style={styles.plusSign}>＋ </Text>
                  Add point
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Match footer */}
        <Text style={styles.footerText}>
          {matchFinished
            ? `${players[0].sets > players[1].sets
                ? players[0].name
                : players[1].name} wins the match!`
            : `Set ${setNumber} of 3 · ${gamesText} games`}
        </Text>
        </View>

        {/* Bottom panel */}
        <View style={styles.bottomPanel}>
          <Text style={styles.bottomPanelTitle}>Match settings</Text>
          <Text style={styles.bottomPanelText}>
            Best of 3 sets · Tie-break at 6–6
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
  },

  scoreboardCapture: {
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 48,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  logo: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: COLORS.lime,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: 31,
    color: COLORS.dark,
  },

  brandName: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2.5,
    color: COLORS.dark
  },

  shareButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: "#E0E5DF",
    alignItems: "center",
    justifyContent: "center",
  },

  titleSection: {
    marginBottom: 20,
  },

  eyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "700",
    color: COLORS.muted,
    marginBottom: 10,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  matchTitle: {
    flexShrink: 1,
    fontSize: 34,
    fontWeight: "500",
    letterSpacing: -1.7,
    color: COLORS.dark,
  },

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },

  resetIcon: {
    fontSize: 27,
    color: COLORS.dark,
  },

  resetText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.dark,
  },

  matchInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
  },

  matchInfo: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.muted,
  },

  liveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  liveDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFE5DE",
    borderWidth: 5,
    borderColor: "#FFE5DE",
  },

  liveText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: 0.5,
  },

  playersContainer: {
    flexDirection: "row",
    gap: 14,
  },

  playersContainerSmall: {
    gap: 8,
  },

  playerCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  firstCard: {
    borderColor: "#BFCFC5",
  },

  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 49,
  },

  avatar: {
    width: 49,
    height: 49,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  avatarText: {
    fontSize: 13,
    fontWeight: "700",
  },

  playerName: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.dark,
  },

  scoreContainer: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },

  score: {
    width: "100%",
    fontSize: 120,
    fontWeight: "700",
    letterSpacing: -5,
    lineHeight: 140,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },

  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    height: 85,
    marginBottom: 15,
  },

  stat: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: COLORS.muted,
  },

  statValue: {
    fontSize: 27,
    fontWeight: "500",
    color: COLORS.dark,
  },

  addButton: {
    height: 68,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },

  darkAddButton: {
    backgroundColor: COLORS.darkGreen,
  },

  limeAddButton: {
    backgroundColor: COLORS.lime,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },

  plusSign: {
    fontSize: 21,
    fontWeight: "500",
  },

  whiteText: {
    color: COLORS.white,
  },

  darkButtonText: {
    color: COLORS.dark,
  },

  footerText: {
    textAlign: "center",
    marginTop: 29,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.muted,
  },

  bottomPanel: {
    marginTop: "auto",
    marginTop: 330,
    borderTopWidth: 1,
    borderColor: "#E7ECE7",
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#FAFBF9",
  },

  bottomPanelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
  },

  bottomPanelText: {
    marginTop: 8,
    fontSize: 13,
    color: COLORS.muted,
  },
});
