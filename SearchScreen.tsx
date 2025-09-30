import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';

const SearchScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5A8D4" />

      <Image
        source={require('../Diary/Parts/Background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5A8D4',
  },
  backgroundImage: {
    position: 'absolute',
    width: 1248,
    height: 2700,
    top: 0,
    left: -3,
    transform: [{ rotate: '0deg' }],
    opacity: 1,
  },
});

export default SearchScreen;