import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color, size }) => <Feather color={color} name="search" size={size} />,
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="ListenToday"
        options={{
          tabBarIcon: ({ color, size }) => <Feather color={color} name="sun" size={size} />,
          title: 'Listen Today',
        }}
      />
      <Tabs.Screen
        name="ListenLater"
        options={{
          tabBarIcon: ({ color, size }) => <Feather color={color} name="bookmark" size={size} />,
          title: 'Listen Later',
        }}
      />
    </Tabs>
  );
}
