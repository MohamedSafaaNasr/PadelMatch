
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Pressable,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle, Line } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

const COLORS = {
  background: "#153D2F",
  lime: "#D7FF35",
  white: "#FFFFFF",
  muted: "#B8C8C1",
  court: "rgba(181, 211, 195, 0.12)",
  black: "#101E19",
};

function CourtIllustration() {
  return (
    <View pointerEvents="none" style={styles.courtContainer}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 480 560"
        preserveAspectRatio="xMidYMid meet"
      >
        <Circle
          cx="255"
          cy="280"
          r="220"
          fill="none"
          stroke={COLORS.court}
          strokeWidth="1"
        />

        <Line
          x1="160"
          y1="73"
          x2="310"
          y2="490"
          stroke={COLORS.court}
          strokeWidth="1.5"
        />

        <Line
          x1="35"
          y1="360"
          x2="470"
          y2="215"
          stroke={COLORS.court}
          strokeWidth="1.5"
        />
      </Svg>
    </View>
  );
}

function Brand() {
  return (
    <View style={styles.brand}>
      <View style={styles.logoBox}>
        <Ionicons
          name="tennisball-outline"
          size={30}
          color={COLORS.black}
        />
      </View>

      <Text style={styles.brandText}>PADEL MATCH</Text>
    </View>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const handleStartMatch = () => {
    // Navigate to your match setup screen.
    console.log("Start a match");
    navigation.navigate("Match");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.screen}>
        {/* Top branding */}
        <Brand />

        {/* Decorative court */}
        <CourtIllustration />

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.eyebrow}>
            PLAY · SCORE · REPEAT
          </Text>

          <Text style={styles.heading}>
            Keep score.{"\n"}
            Stay in the game.
          </Text>

          <Text style={styles.description}>
            A simple match counter built to keep every point,
            game, and set right at your fingertips.
          </Text>

          <View style={styles.bottomSection}>
            <Pressable
              onPress={(e) => handleStartMatch()}
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.ctaPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Start a match"
            >
              <Text style={styles.ctaText}>
                Start a match
              </Text>

              <View style={styles.arrowBox}>
                <Ionicons
                  name="arrow-forward"
                  size={27}
                  color={COLORS.white}
                />
              </View>
            </Pressable>

            <Text style={styles.footer}>
              No sign-up required
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
    paddingHorizontal: 30,
    paddingTop: 24,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    zIndex: 2,
  },

  logoBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.lime,
    alignItems: "center",
    justifyContent: "center",
  },

  brandText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2.5,
  },

  courtContainer: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.91,
    height: SCREEN_WIDTH * 0.91,
    top: SCREEN_HEIGHT * 0.13,
    right: -SCREEN_WIDTH * 0.19,
  },

  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
    zIndex: 1,
  },

  eyebrow: {
    color: COLORS.lime,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2.2,
    marginBottom: 28,
  },

  heading: {
    color: COLORS.white,
    fontSize: Math.min(SCREEN_WIDTH * 0.083, 44),
    lineHeight: Math.min(SCREEN_WIDTH * 0.097, 51),
    fontWeight: "700",
    letterSpacing: -2,
    marginBottom: 30,
  },

  description: {
    color: COLORS.muted,
    fontSize: 17,
    lineHeight: 29,
    fontWeight: "400",
    maxWidth: 440,
  },

  bottomSection: {
    marginTop: 72,
    marginBottom: 8,
  },

  cta: {
    minHeight: 88,
    backgroundColor: COLORS.lime,
    borderRadius: 25,
    paddingLeft: 32,
    paddingRight: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },

  ctaText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  arrowBox: {
    width: 63,
    height: 63,
    borderRadius: 19,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    color: "#8FA99C",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.4,
    textAlign: "center",
    marginTop: 20,
  },
});
