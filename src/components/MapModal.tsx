import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { interactiveMapHtml } from '@/config/mapbox';

// react-native-webview has no web build — only require it on native.
const WebView: any = Platform.OS === 'web' ? null : require('react-native-webview').WebView;

interface Props {
  visible: boolean;
  onClose: () => void;
  lng: number;
  lat: number;
}

/**
 * Full-screen interactive Mapbox map. Opens the real Mapbox GL JS map (pan/zoom)
 * in a WebView on native and an <iframe> on web — never Google/Apple Maps.
 */
export default function MapModal({ visible, onClose, lng, lat }: Props) {
  const insets = useSafeAreaInsets();
  const html = interactiveMapHtml(lng, lat);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        {Platform.OS === 'web'
          ? React.createElement('iframe', {
              srcDoc: html,
              style: { border: 'none', width: '100%', height: '100%' },
            })
          : (
            <WebView
              originWhitelist={['*']}
              source={{ html }}
              style={StyleSheet.absoluteFill}
              javaScriptEnabled
              domStorageEnabled
            />
          )}

        <TouchableOpacity style={[styles.closeBtn, { top: insets.top + 10 }]} onPress={onClose}>
          <X size={22} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  closeBtn: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
