import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
  PanResponder,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { NativeModules } from "react-native";
import AppListItem from "../Components/AppListItem/AppListItem";

const { AppList } = NativeModules;
const { height } = Dimensions.get("window");

const LauncherScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [apps, setApps] = useState([]);
  const [HomeApps, setHomeApps] = useState([{ label: 'select App', packageName: '' }, { label: 'select App', packageName: '' }, { label: 'select App', packageName: '' }, { label: 'select App', packageName: '' }, { label: 'select App', packageName: '' }]);
  // const [HomeApps, setHomeApps] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [replaceApp, setReplaceApp] = useState()
  const translateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    fetchInstalledApps();
  }, []);

  const fetchInstalledApps = async () => {
    try {
      const installedApps = await AppList.getInstalledApps();
      console.log(JSON.parse(installedApps));
      console.log(installedApps);
      
      setApps(JSON.parse(installedApps));
    } catch (error) {
      console.error("Error fetching apps:", error);
    }
  };

  const launchApp = (packageName) => {
    AppList.launchApp(packageName);
  };

  const filteredApps = apps.filter((app) =>
    app.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setTimeout(() => Keyboard.dismiss(), 100));
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dx, dy } = gestureState;
  
        if (dy < -50) {
          openModal(); // Swipe up to open modal
        } else if (dy > 50) {
          closeModal(); // Swipe down to close modal
        } else if (dx < -50) {
          console.log("Swiped Left");
          launchApp('com.android.settings')
          // Handle left swipe (e.g., move to next screen or show options)
        } else if (dx > 50) {
          
          console.log("Swiped Right");
          launchApp('com.android.vending')
          // Handle right swipe (e.g., go back or open settings)
        }
      },
    })
  ).current;
  const selectAppForHome = (index) => {
    setReplaceApp(index)
    openModal()
  }
  const replaceAppHome = (item:any) => {

    setHomeApps((prevApps) => {
    const updatedApps = [...prevApps];

    if (updatedApps[replaceApp]) {
      // Replace existing app at index
      updatedApps[replaceApp] = { packageName: item.packageName, label: item.label };
    } else {
      // Add new app at index if it doesn't exist
      updatedApps.push({ packageName: item.packageName, label: item.label });
    }

    return updatedApps;
  });
    setReplaceApp(null)
    closeModal();
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* <TouchableWithoutFeedback onLongPress={console.log}> */}
      <View style={styles.bottomRightContainer}>
        <FlatList
          data={HomeApps}
          keyExtractor={(item) => item?.packageName}
          renderItem={({ item,index }) => (
            <TouchableOpacity
              style={styles.appItem}
              onPress={() => launchApp(item?.packageName)}
              onLongPress={()=>selectAppForHome(index)}
            >
              <Text style={styles.appLabel}>{item?.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Full-Screen Modal with Swipe-Down to Close */}
      {isModalVisible && (
        <Modal transparent={true} animationType="fade" onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[styles.modalContainer, { transform: [{ translateY }] }]}
              {...panResponder.panHandlers}
            >
              <TextInput
                style={styles.searchInput}
                placeholder="Search apps..."
                autoFocus={true}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />

              <FlatList
                data={filteredApps}
                keyExtractor={(item) => item.packageName}
                renderItem={({ item }) => (
                  
                  <AppListItem
                  item={item}
                  />
                )}
              />
            </Animated.View>
          </View>
        </Modal>
      )}
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
};
// <TouchableOpacity
                  //   style={styles.appItem}
                  //   onPress={() => replaceApp ?
                  //     replaceAppHome(item)
                  //     :

                  //     launchApp(item.packageName)}
                  // >
                  //   <Text style={styles.appLabel}>{item.label}</Text>
                  // </TouchableOpacity>
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  swipeUpArea: {
    position: "absolute",
    bottom: 50,
    width: "80%",
    paddingVertical: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    borderRadius: 10,
  },
  swipeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    paddingTop: 50,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
  },
  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginBottom: 10,
  },
  appItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  appLabel: {
    fontSize: 16,
  },
  bottomRightContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 10,
    padding: 10,
  },
});

export default LauncherScreen;