import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="Search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="ListenToday"
        options={{
          title: 'Listen Today',
        }}
      />
      <Tabs.Screen
        name="ListenLater"
        options={{
          title: 'Listen Later',
        }}
      />
    </Tabs>
  );
}
