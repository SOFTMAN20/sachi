import React, { useEffect, useState } from 'react';
import { View, Image, Pressable, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

// On web, expo-video's <video> keeps its intrinsic size (absolute + inset:0 alone
// doesn't stretch a replaced element). Force it to fill its container.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const id = 'expo-video-fill-style';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = 'video{width:100%!important;height:100%!important;}';
    document.head.appendChild(s);
  }
}

interface Props {
  uri: string;
  poster?: string;
  /** Whether this video is the one currently in view — plays when true, pauses otherwise. */
  active: boolean;
  /** Fill mode: 'cover' (feed) keeps aspect by cropping. */
  contentFit?: 'cover' | 'contain';
  style?: StyleProp<ViewStyle>;
  /** Show the mute/unmute toggle. */
  showMute?: boolean;
  /** Initial muted state (feed autoplay must start muted for browsers/native). */
  startMuted?: boolean;
}

/**
 * Instagram-style autoplaying video tile. Shows the poster image until the
 * video frame is ready, plays (muted + looping) while `active`, pauses when not.
 */
export default function PropertyVideo({
  uri,
  poster,
  active,
  contentFit = 'cover',
  style,
  showMute = true,
  startMuted = true,
}: Props) {
  const [muted, setMuted] = useState(startMuted);

  const player = useVideoPlayer(uri, p => {
    p.loop = true;
    p.muted = startMuted;
  });

  useEffect(() => {
    player.muted = muted;
  }, [muted, player]);

  useEffect(() => {
    if (active) {
      player.play();
    } else {
      player.pause();
    }
  }, [active, player]);

  return (
    <View style={[styles.wrap, style]}>
      {poster ? (
        <Image source={{ uri: poster }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : null}
      {/* Mount the video only while active — inactive tiles show the poster photo
          (Instagram-style, avoids paused frames and saves resources). */}
      {active ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit={contentFit}
          nativeControls={false}
          pointerEvents="none"
        />
      ) : null}
      {showMute && active ? (
        <Pressable
          style={styles.muteBtn}
          onPress={() => setMuted(m => !m)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {muted ? (
            <VolumeX size={15} color="#FFFFFF" strokeWidth={2} />
          ) : (
            <Volume2 size={15} color="#FFFFFF" strokeWidth={2} />
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  muteBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
