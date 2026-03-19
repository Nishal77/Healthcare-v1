import { Text, TouchableOpacity, View } from 'react-native';

type Tab = 'details' | 'records';

interface AccountTabsProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export function AccountTabs({ active, onChange }: AccountTabsProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 4,
      }}>
      {(['details', 'records'] as Tab[]).map(tab => {
        const isActive = active === tab;
        const label = tab === 'details' ? 'Account Details' : 'Health Records';
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => onChange(tab)}
            style={{
              paddingVertical: 14,
              paddingHorizontal: 4,
              marginRight: 24,
              borderBottomWidth: 2.5,
              borderBottomColor: isActive ? '#2C6E49' : 'transparent',
            }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#2C6E49' : '#9CA3AF',
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
