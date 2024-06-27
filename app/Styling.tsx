import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import LayoutTwoColumnsIcon from '@/components/LayoutTwoColumnsIcon';
import LayoutThreeColumnsIcon from '@/components/LayoutThreeColumnsIcon';
import LayoutFourColumnsIcon from '@/components/LayoutFourColumnsIcon';

type Item = {
  id: number;
  src: any; // Adjust this type based on your actual image source type
};

type RowItems = Item[];

const upperBody: Item[] = [
  { id: 1, src: require('@/assets/images/kazak.png') },
  { id: 2, src: require('@/assets/images/triko.png') },
];

const lowerBody: Item[] = [
  { id: 3, src: require('@/assets/images/pantolon.png') },
];

const fullBody: Item[] = [
  { id: 4, src: require('@/assets/images/elbise.png') },
];

const outerwear: Item[] = [
  { id: 5, src: require('@/assets/images/mont.png') },
];

const shoes: Item[] = [
  { id: 6, src: require('@/assets/images/ayakkabi.png') },
];

const getRows = (numRows: number): RowItems[] => {
  switch (numRows) {
    case 2:
      return [fullBody, shoes];
    case 3:
      return [upperBody, lowerBody, shoes];
    case 4:
      return [outerwear, upperBody, lowerBody, shoes];
    default:
      return [];
  }
};


const Styling = () => {
  const [numRows, setNumRows] = useState<number>(2);
  const rows: RowItems[] = getRows(numRows);
  
  const renderRow = (rowItems: RowItems, rowIndex: number) => {
    return (
      <FlatList
        data={rowItems}
        keyExtractor={(item, index) => `${item.id}-${index}-${rowIndex}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.src} style={styles.itemImage} />
            <TouchableOpacity style={styles.pinIcon}>
              <AntDesign name="pushpino" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        onEndReached={() => {
          rowItems.push(...rowItems.map(item => ({ ...item, id: item.id + Math.random() }))); // Generate unique IDs for duplicated items
        }}
        onEndReachedThreshold={0.5}
        onScroll={({ nativeEvent }) => {
          const maxOffset = nativeEvent.contentSize.width - nativeEvent.layoutMeasurement.width;
          if (nativeEvent.contentOffset.x <= 0) {
            
          } 
        }}
        scrollEventThrottle={16}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => renderRow(item, index)}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.rowSelector}>
        <TouchableOpacity onPress={() => setNumRows(2)}>
          <LayoutTwoColumnsIcon width={24} height={24} stroke={numRows === 2 ? '#91DDCF' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setNumRows(3)}>
          <LayoutThreeColumnsIcon width={24} height={24} stroke={numRows === 3 ? '#91DDCF' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setNumRows(4)}>
          <LayoutFourColumnsIcon width={24} height={24} stroke={numRows === 4 ? '#91DDCF' : 'black'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  itemContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 200,
    height: 200,
  },
  pinIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  rowSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default Styling;
