import React, { useEffect, useRef } from 'react';
import {
  View, Modal, Animated, PanResponder, StyleSheet, Pressable, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Height (fraction of screen) the sheet opens to. Drag up to expand, down to dismiss. */
  midRatio?: number;
}

/**
 * Bolt-style draggable bottom sheet. Opens at a mid height; drag the handle up to
 * snap to (almost) full screen or down to dismiss. Animates the sheet HEIGHT (not
 * translateY) so footer content stays pinned to the bottom at every snap point.
 */
export default function BottomSheet({ visible, onClose, children, midRatio = 0.6 }: Props) {
  const { height: screenH } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const MAX_H = screenH - insets.top - 8;
  const MID_H = Math.min(MAX_H, screenH * midRatio);

  const heightV = useRef(new Animated.Value(0)).current;
  const lastH = useRef(0);
  // Latest snap metrics, so the (stable) PanResponder closures always read fresh values.
  const m = useRef({ MAX_H, MID_H });
  m.current = { MAX_H, MID_H };

  const animateTo = (toValue: number, cb?: () => void) => {
    lastH.current = toValue;
    Animated.spring(heightV, { toValue, useNativeDriver: false, bounciness: 0, speed: 16 })
      .start(({ finished }) => { if (finished) cb?.(); });
  };
  const close = () => animateTo(0, onClose);

  useEffect(() => {
    if (visible) {
      heightV.setValue(0);
      requestAnimationFrame(() => animateTo(m.current.MID_H));
    }
  }, [visible]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        const next = lastH.current - g.dy; // drag up (negative dy) grows the sheet
        heightV.setValue(Math.max(0, Math.min(m.current.MAX_H, next)));
      },
      onPanResponderRelease: (_, g) => {
        const { MAX_H, MID_H } = m.current;
        const cur = lastH.current - g.dy;
        if (g.vy > 1.1 || cur < MID_H * 0.55) close();
        else if (g.vy < -1.1 || cur > (MID_H + MAX_H) / 2) animateTo(MAX_H);
        else animateTo(MID_H);
      },
    })
  ).current;

  const backdropOpacity = heightV.interpolate({
    inputRange: [0, MID_H],
    outputRange: [0, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        </Animated.View>
        <Animated.View style={[styles.sheet, { height: heightV }]}>
          <View {...pan.panHandlers} style={styles.dragArea}>
            <View style={styles.handle} />
          </View>
          <View style={[styles.content, { paddingBottom: insets.bottom + 12 }]}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
  },
  dragArea: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D1D5DB' },
  content: { flex: 1, paddingHorizontal: 24 },
});
