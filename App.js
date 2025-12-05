import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./navigation";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
