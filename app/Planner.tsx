import React, { useRef, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const itemWidth = screenWidth * 0.5;
const separatorWidth = (screenWidth - itemWidth) / 2;

const slots = ['', 'Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5', ''];

const Planner = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(1); // Start with the first slot selected
  const flatListRef = useRef<FlatList<any>>(null);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (itemWidth+separatorWidth)); // Change this line to use screen width
    setSelectedIndex(index);
  };

  const handleSnapToItem = (index: number) => {
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const scrollRight = () => {
    if (selectedIndex < slots.length - 1) {
      handleSnapToItem(selectedIndex + 1);
    }
  };

  const scrollLeft = () => {
    if (selectedIndex > 0) {
      handleSnapToItem(selectedIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <FlatList
        data={slots}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        snapToAlignment="start"
        snapToInterval={separatorWidth+itemWidth} // Change this line to use screen width
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <View style={styles.slotContainer}>
            <View style={[styles.slot, selectedIndex === index && styles.selectedSlot]}>
              <Text style={styles.slotText}>{item}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ width: separatorWidth }} />}
        onScroll={handleScroll}
        onMomentumScrollEnd={() => handleSnapToItem(selectedIndex)}
        ref={flatListRef}
        initialScrollIndex={1}
        getItemLayout={(data, index) => (
          { length: screenWidth, offset: (separatorWidth+itemWidth) * index, index } // Change this line to use screen width
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={scrollLeft} style={styles.button}>
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={scrollRight} style={styles.button}>
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: separatorWidth,
  },
  slotContainer: {
    width: itemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: 'transparent',
    borderWidth: 2,
  },
  selectedSlot: {
    borderColor: '#fff',
  },
  slotText: {
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
});

export default Planner;
