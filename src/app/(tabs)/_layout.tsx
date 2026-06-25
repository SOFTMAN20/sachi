// Native bottom tabs (system) for iOS & Android. Web uses _layout.web.tsx (JS Tabs).
import { NativeTabs, Icon, Label, VectorIcon } from 'expo-router/unstable-native-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const PRIMARY = '#1B6B3A';

export default function TabLayout() {
  return (
    <NativeTabs tintColor={PRIMARY} backgroundColor="#FFFFFF">
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf="house.fill" androidSrc={<VectorIcon family={MaterialIcons} name="home" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Label>Explore</Label>
        <Icon sf="magnifyingglass" androidSrc={<VectorIcon family={MaterialIcons} name="search" />} />
      </NativeTabs.Trigger>

      {/* Reachable route (Account -> Saved) but hidden from the bar */}
      <NativeTabs.Trigger name="saved" hidden />

      <NativeTabs.Trigger name="messages">
        <Label>Messages</Label>
        <Icon sf="message.fill" androidSrc={<VectorIcon family={MaterialIcons} name="chat-bubble" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Account</Label>
        <Icon sf="person.fill" androidSrc={<VectorIcon family={MaterialIcons} name="person" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
