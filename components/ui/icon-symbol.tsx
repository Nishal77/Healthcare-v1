// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // navigation
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  // healthcare tabs
  'calendar': 'event',
  'doc.text.fill': 'description',
  'person.2.fill': 'people',
  'person.fill': 'person',
  'magnifyingglass': 'search',
  'plus.circle.fill': 'add-circle',
  'stethoscope': 'medical-services',
  'sparkles': 'auto-awesome',
  'play.circle.fill': 'play-circle',
  'waveform.path.ecg': 'monitor-heart',
  'note.text': 'edit-note',
  'chart.bar.fill': 'bar-chart',
  // misc
  'heart.fill': 'favorite',
  'bell.fill': 'notifications',
  'gear': 'settings',
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
