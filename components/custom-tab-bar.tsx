import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';

// ─── Constants ───────────────────────────────────────────────────────────────
const ACTIVE_COLOR = '#007AFF';
const INACTIVE_COLOR = '#1C1C1E';
const ACTIVE_BG = '#E8E8ED';

const PILL_ROUTES = ['index', 'appointments', 'records', 'providers'];
const SEARCH_ROUTE = 'search';

const LABELS: Record<string, string> = {
  index: 'Today',
  appointments: 'Appts',
  records: 'Records',
  providers: 'Care',
};

const ICONS: Record<string, React.ComponentProps<typeof IconSymbol>['name']> = {
  index: 'house.fill',
  appointments: 'calendar',
  records: 'doc.text.fill',
  providers: 'person.2.fill',
};

// ─── Component ───────────────────────────────────────────────────────────────
export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const focusedName = state.routes[state.index]?.name;

  function handlePress(routeName: string, routeKey: string) {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const event = navigation.emit({
      type: 'tabPress',
      target: routeKey,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.dispatch(
        CommonActions.navigate({ name: routeName, merge: true }),
      );
    }
  }

  const pillRoutes = state.routes.filter(r => PILL_ROUTES.includes(r.name));
  const searchRoute = state.routes.find(r => r.name === SEARCH_ROUTE);
  const isSearchFocused = focusedName === SEARCH_ROUTE;

  return (
    <View
      style={[
        styles.container,
        { bottom: insets.bottom + (Platform.OS === 'ios' ? 12 : 16) },
      ]}
      pointerEvents="box-none">

      {/* ── Pill ─────────────────────────────────────────────────── */}
      <View style={styles.pill}>
        {pillRoutes.map(route => {
          const isFocused = focusedName === route.name;
          const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          return (
            <Pressable
              key={route.key}
              onPress={() => handlePress(route.name, route.key)}
              style={styles.pillTab}
              accessibilityRole="button"
              accessibilityLabel={LABELS[route.name]}>
              <View style={[styles.activeWrap, isFocused && styles.activeWrapVisible]}>
                <IconSymbol name={ICONS[route.name]} size={26} color={color} />
                <Text style={[styles.label, { color }]}>
                  {LABELS[route.name]}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ── Separate search circle ───────────────────────────────── */}
      {searchRoute && (
        <Pressable
          onPress={() => handlePress(SEARCH_ROUTE, searchRoute.key)}
          style={styles.searchCircle}
          accessibilityRole="button"
          accessibilityLabel="Search">
          <IconSymbol
            name="magnifyingglass"
            size={26}
            color={isSearchFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
          />
        </Pressable>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  android: { elevation: 10 },
  default: {},
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // ── Pill ──────────────────────────────────────────────────────
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 6,
    ...SHADOW,
  },
  pillTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Active tab inner circle (wraps icon + label)
  activeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: 64,
  },
  activeWrapVisible: {
    backgroundColor: ACTIVE_BG,
  },

  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.2,
  },

  // ── Search circle ──────────────────────────────────────────────
  searchCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
});
