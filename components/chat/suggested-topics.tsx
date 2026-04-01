import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Topic {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  bg: string;
  iconBg: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  decorIcon: ComponentProps<typeof Ionicons>['name'];
}

const TOPICS: Topic[] = [
  {
    id: '1',
    title:    'Analyze\nmy vitals',
    subtitle: 'Heart rate · SpO₂ · HRV',
    badge:    'Most relevant',
    bg:       '#0F2D1E',
    iconBg:   'rgba(44,110,73,0.35)',
    icon:     'pulse-outline',
    iconColor:'#6EE7A0',
    decorIcon:'heart-outline',
  },
  {
    id: '2',
    title:    'Symptom\nchecker',
    subtitle: 'AI-powered diagnosis',
    bg:       '#0F1E2D',
    iconBg:   'rgba(11,110,139,0.35)',
    icon:     'medical-outline',
    iconColor:'#67D2F0',
    decorIcon:'body-outline',
  },
  {
    id: '3',
    title:    'Sleep\nanalysis',
    subtitle: 'Patterns · Recovery',
    bg:       '#1A1040',
    iconBg:   'rgba(99,91,210,0.35)',
    icon:     'moon-outline',
    iconColor:'#C4B5FD',
    decorIcon:'star-outline',
  },
  {
    id: '4',
    title:    'Nutrition\nadvice',
    subtitle: 'Diet · Balance · Energy',
    bg:       '#2D1608',
    iconBg:   'rgba(196,134,10,0.35)',
    icon:     'leaf-outline',
    iconColor:'#FCD34D',
    decorIcon:'nutrition-outline',
  },
];

interface SuggestedTopicsProps {
  onSelect?: (topic: string) => void;
}

export function SuggestedTopics({ onSelect }: SuggestedTopicsProps) {
  return (
    <View style={{ paddingBottom: 4 }}>
      {/* Section header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 14,
        }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', letterSpacing: 0.1 }}>
          Suggested Topics for You
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#9CA3AF' }}>Sort with</Text>
          <Ionicons name="chevron-down" size={12} color="#9CA3AF" />
        </View>
      </View>

      {/* Horizontal cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, gap: 12 }}
        decelerationRate="fast"
        snapToInterval={212}>

        {TOPICS.map(topic => (
          <TouchableOpacity
            key={topic.id}
            activeOpacity={0.9}
            onPress={() => onSelect?.(topic.title.replace('\n', ' '))}
            style={{
              width: 200,
              height: 240,
              borderRadius: 22,
              backgroundColor: topic.bg,
              overflow: 'hidden',
            }}>

            {/* Decorative background icon */}
            <View
              style={{
                position: 'absolute',
                right: -20,
                top: -20,
                opacity: 0.07,
              }}>
              <Ionicons name={topic.decorIcon} size={160} color="#FFFFFF" />
            </View>

            {/* Icon badge */}
            <View style={{ padding: 16 }}>
              {topic.badge && (
                <View
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 }}>
                    {topic.badge}
                  </Text>
                </View>
              )}

              {/* Main icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: topic.iconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: topic.badge ? 0 : 36,
                }}>
                <Ionicons name={topic.icon} size={24} color={topic.iconColor} />
              </View>
            </View>

            {/* Bottom: title + arrow */}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 16,
                paddingTop: 28,
                // subtle bottom gradient via layered semi-transparent bg
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF', lineHeight: 24, letterSpacing: -0.4 }}>
                    {topic.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 3, fontWeight: '500' }}>
                    {topic.subtitle}
                  </Text>
                </View>

                {/* Arrow button */}
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#FFFFFF',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 10,
                    flexShrink: 0,
                  }}>
                  <Ionicons name="arrow-forward" size={16} color="#0F1923" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
