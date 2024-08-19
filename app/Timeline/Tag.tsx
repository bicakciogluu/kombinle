// components/Tag.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TagProps {
  title: string;
}

const Tag = (props:TagProps) => {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C3A0FB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 5,
    
  },
  tagText: {
    color: 'white',
    marginRight: 5,
    fontFamily: 'Poppins-Medium',
  },
});

export default Tag;
