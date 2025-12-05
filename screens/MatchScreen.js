import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { captureRef } from "react-native-view-shot";

const MatchScreen = () => {
  const navigation = useNavigation();
  const viewRef = useRef();
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Games, setTeam1Games] = useState(0);
  const [team2Games, setTeam2Games] = useState(0);
  const [team1Sets, setTeam1Sets] = useState(0);
  const [team2Sets, setTeam2Sets] = useState(0);
  const [team1Name, setTeam1Name] = useState("Team 1");
  const [team2Name, setTeam2Name] = useState("Team 2");
  const [editingTeam, setEditingTeam] = useState(null);
  const [tempName, setTempName] = useState("");

  const padelPoints = [0, 15, 30, 40];

  const getScoreDisplay = (score) => {
    if (score < 4) return padelPoints[score];
    return "AD";
  };

  const addPointTeam1 = () => {
    let newScore = team1Score + 1;
    let newTeam2Score = team2Score;

    // Deuce and advantage logic
    if (team1Score >= 3 && team2Score >= 3) {
      if (team1Score === team2Score) {
        setTeam1Score(4);
        return;
      }
      if (team1Score === 4) {
        winGame(1);
        return;
      }
      setTeam1Score(4);
      setTeam2Score(3);
      return;
    }

    // Normal scoring
    if (newScore >= 4) {
      winGame(1);
    } else {
      setTeam1Score(newScore);
    }
  };

  const addPointTeam2 = () => {
    let newScore = team2Score + 1;

    // Deuce and advantage logic
    if (team1Score >= 3 && team2Score >= 3) {
      if (team1Score === team2Score) {
        setTeam2Score(4);
        return;
      }
      if (team2Score === 4) {
        winGame(2);
        return;
      }
      setTeam2Score(4);
      setTeam1Score(3);
      return;
    }

    // Normal scoring
    if (newScore >= 4) {
      winGame(2);
    } else {
      setTeam2Score(newScore);
    }
  };

  const winGame = (team) => {
    setTeam1Score(0);
    setTeam2Score(0);

    if (team === 1) {
      const newGames = team1Games + 1;
      if (newGames >= 6 && newGames - team2Games >= 2) {
        winSet(1);
      } else if (newGames === 7 && team2Games === 6) {
        winSet(1);
      } else {
        setTeam1Games(newGames);
      }
    } else {
      const newGames = team2Games + 1;
      if (newGames >= 6 && newGames - team1Games >= 2) {
        winSet(2);
      } else if (newGames === 7 && team1Games === 6) {
        winSet(2);
      } else {
        setTeam2Games(newGames);
      }
    }
  };

  const winSet = (team) => {
    if (team === 1) {
      setTeam1Sets(team1Sets + 1);
    } else {
      setTeam2Sets(team2Sets + 1);
    }
    setTeam1Games(0);
    setTeam2Games(0);
  };

  const resetMatch = () => {
    setTeam1Score(0);
    setTeam2Score(0);
    setTeam1Games(0);
    setTeam2Games(0);
    setTeam1Sets(0);
    setTeam2Sets(0);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setTempName(team === 1 ? team1Name : team2Name);
  };

  const saveTeamName = () => {
    if (tempName.trim()) {
      if (editingTeam === 1) {
        setTeam1Name(tempName.trim());
      } else {
        setTeam2Name(tempName.trim());
      }
    }
    setEditingTeam(null);
    setTempName("");
  };

  const shareScore = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.9,
        result: "tmpfile",
      });

      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share Match Score",
      });
    } catch (error) {
      Alert.alert("Error", `Failed to share: ${error.message}`);
      console.error("Share error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Match Score</Text>
        <TouchableOpacity style={styles.shareButton} onPress={shareScore}>
          <Ionicons name="share-social" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.screenshotView} ref={viewRef} collapsable={false}>
        <View style={styles.scoreBoard}>
          <View style={styles.teamColumn}>
            <TouchableOpacity
              style={styles.teamHeader}
              onPress={() => openEditModal(1)}
            >
              <Text style={styles.teamName}>{team1Name}</Text>
              <Ionicons
                name="pencil"
                size={16}
                color="rgba(255, 255, 255, 0.6)"
                style={styles.editIcon}
              />
            </TouchableOpacity>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Sets</Text>
              <Text style={styles.scoreValue}>{team1Sets}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Games</Text>
              <Text style={styles.scoreValue}>{team1Games}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.points}>{getScoreDisplay(team1Score)}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addPointTeam1}>
              <Ionicons name="add-circle" size={64} color="#10b981" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.teamColumn}>
            <TouchableOpacity
              style={styles.teamHeader}
              onPress={() => openEditModal(2)}
            >
              <Text style={styles.teamName}>{team2Name}</Text>
              <Ionicons
                name="pencil"
                size={16}
                color="rgba(255, 255, 255, 0.6)"
                style={styles.editIcon}
              />
            </TouchableOpacity>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Sets</Text>
              <Text style={styles.scoreValue}>{team2Sets}</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreLabel}>Games</Text>
              <Text style={styles.scoreValue}>{team2Games}</Text>
            </View>
            <View style={styles.pointsContainer}>
              <Text style={styles.points}>{getScoreDisplay(team2Score)}</Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addPointTeam2}>
              <Ionicons name="add-circle" size={64} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetMatch}>
        <Ionicons name="refresh" size={20} color="#ef4444" />
        <Text style={styles.resetText}>Reset Match</Text>
      </TouchableOpacity>

      <Modal
        visible={editingTeam !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditingTeam(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Team</Text>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter team name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              autoFocus
              maxLength={20}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditingTeam(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveTeamName}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003252",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
  shareButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  screenshotView: {
    flex: 1,
  },
  scoreBoard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  teamColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "45%",
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 1,
  },
  editIcon: {
    marginLeft: 4,
  },
  scoreRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  scoreLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  scoreValue: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  pointsContainer: {
    marginVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  points: {
    fontSize: 72,
    fontWeight: "800",
    color: "#10b981",
    textShadowColor: "rgba(16, 185, 129, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  divider: {
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  addButton: {
    marginTop: 20,
    padding: 10,
  },
  resetButton: {
    flexDirection: "row",
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 2,
    borderColor: "#ef4444",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 40,
    gap: 10,
  },
  resetText: {
    color: "#ef4444",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#003252",
    borderRadius: 20,
    padding: 30,
    width: "85%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: "#fff",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#10b981",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default MatchScreen;
