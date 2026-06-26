import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Search, MessageCircle, User } from 'lucide-react-native';
import React from 'react';

// Custom JS tab bar (renders a real native bottom tab bar via React Navigation).
// Used on every platform — reliable, always visible, and tappable. The alpha
// system NativeTabs were causing the tab bar to disappear, so we don't use them.
const PRIMARY = '#1B6B3A';
const INACTIVE = '#9CA3AF';

// Icon wrapper component to ensure proper rendering
const TabIcon = ({ IconComponent, color, focused }: { IconComponent: any; color: string; focused: boolean }) => (
  <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
    <IconComponent size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={Search} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          href: null,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={MessageCircle} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon IconComponent={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  tabLabel: { 
    fontSize: 11, 
    fontWeight: '600', 
    marginTop: 4 
  },
  tabItem: { 
    paddingTop: 4,
    paddingBottom: 4,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 32,
  },
  activeIconWrap: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    height: 32,
  },
});
