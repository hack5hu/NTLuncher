import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

interface AppListProps {
  item: {label: string; packageName: string};
  replaceApp?: boolean;
  replaceAppHome?: (item: {label: string; packageName: string}) => void;
  launchApp: (packageName: string) => void;
}

const AppListItem: React.FC<AppListProps> = ({
  item,
  replaceApp,
  replaceAppHome,
  launchApp,
}) => {
  return (
    <TouchableOpacity
      style={styles.appItem}
      onPress={() =>
        replaceApp && replaceAppHome
          ? replaceAppHome(item)
          : launchApp(item.packageName)
      }>
      <Text style={styles.appLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
};

export default AppListItem;

const styles = StyleSheet.create({
  appItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  appLabel: {
    fontSize: 16,
    color: 'black',
  },
});
