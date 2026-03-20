import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Fragment } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';

// ─── Constants ───────────────────────────────────────────────────────────────
const ACTIVE_COLOR = '#2C6E49'; // Brand deep green
const INACTIVE_COLOR = '#1C1C1E'; // Premium dark black
const ACTIVE_BG = '#E9F0EC'; // Very light green background

const PILL_ROUTES = ['index', 'track', 'learn', 'care'];
const ACCOUNT_ROUTE = 'profile';

const LABELS: Record<string, string> = {
  index: 'Home',
  track: 'Track',
  learn: 'Learn',
  care: 'Care',
};

const ICONS: Record<string, React.ComponentProps<typeof IconSymbol>['name']> = {
  index: 'house.fill',
  track: 'sparkles',
  learn: 'play.circle.fill',
  care: 'waveform.path.ecg',
};

// ─── Bottom fade gradient (pure View, no extra deps) ─────────────────────────
// Simulates a white fade from transparent → opaque going bottom-to-top
// so content behind/below the tab bar softly disappears
const GRADIENT_HEIGHT = 140;
const STOPS = 12;

function BottomFade({ bottomInset }: { bottomInset: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: GRADIENT_HEIGHT + bottomInset,
      }}>
      {Array.from({ length: STOPS }, (_, i) => {
        // i=0 → bottom of screen (fully white), i=STOPS-1 → top (transparent)
        const t = i / (STOPS - 1); // 0 at bottom, 1 at top
        const opacity = Math.pow(1 - t, 1.6) * 0.97; // smooth ease-in curve
        const sliceHeight = (GRADIENT_HEIGHT + bottomInset) / STOPS;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              bottom: i * sliceHeight,
              left: 0,
              right: 0,
              height: sliceHeight + 1, // +1 prevents hairline gaps
              backgroundColor: `rgba(255,255,255,${opacity.toFixed(3)})`,
            }}
          />
        );
      })}
    </View>
  );
}

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
  const accountRoute = state.routes.find(r => r.name === ACCOUNT_ROUTE);
  const isAccountFocused = focusedName === ACCOUNT_ROUTE;

  return (
    <Fragment>
      {/* ── Soft white fade behind the tab bar ───────────────────── */}
      <BottomFade bottomInset={insets.bottom} />

      {/* ── Tab bar row ──────────────────────────────────────────── */}
      <View
        style={[styles.container, { bottom: insets.bottom + 4 }]}
        pointerEvents="box-none">

        {/* Pill */}
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
                  <Text style={[styles.label, { color }]}>{LABELS[route.name]}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Account circle */}
        {accountRoute && (
          <Pressable
            onPress={() => handlePress(ACCOUNT_ROUTE, accountRoute.key)}
            style={[styles.accountCircle, isAccountFocused && styles.accountCircleActive]}
            accessibilityRole="button"
            accessibilityLabel="Me">
            <IconSymbol
              name="person.fill"
              size={26}
              color={isAccountFocused ? '#FFFFFF' : INACTIVE_COLOR}
            />
          </Pressable>
        )}
      </View>
    </Fragment>
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

  // ── Account circle ─────────────────────────────────────────────
  accountCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  accountCircleActive: {
    backgroundColor: '#2C6E49',
  },
});
