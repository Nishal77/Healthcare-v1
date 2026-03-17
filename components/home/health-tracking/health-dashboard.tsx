import { View } from 'react-native';

import { HealthSectionHeader } from './health-section-header';

interface HealthDashboardProps {
  onSeeAll?: () => void;
}

export function HealthDashboard({ onSeeAll }: HealthDashboardProps) {
  return (
    <View>
      <HealthSectionHeader onSeeAll={onSeeAll} />
    </View>
  );
}
