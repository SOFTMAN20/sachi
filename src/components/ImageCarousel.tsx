import React, { useState } from 'react';
import {
  View, Image, FlatList, StyleSheet, StyleProp, ViewStyle,
} from 'react-native';

interface Props {
  images: string[];
  style?: StyleProp<ViewStyle>;
  resizeMode?: 'cover' | 'contain';
}

/**
 * Instagram-style swipeable photo carousel with dot indicators.
 * Used for listings that have photos but no video.
 */
export default function ImageCarousel({ images, style, resizeMode = 'cover' }: Props) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  return (
    <View
      style={[styles.wrap, style]}
      onLayout={e => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, i) => `${i}-${uri}`}
          onMomentumScrollEnd={e =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width, height: '100%' }}
              resizeMode={resizeMode}
            />
          )}
        />
      )}

      {images.length > 1 && (
        <View style={styles.dots} pointerEvents="none">
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: '#ECEEF0' },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
