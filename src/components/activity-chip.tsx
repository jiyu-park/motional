import { Tag } from '@/components/ui';

type Props = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function ActivityChip({ emoji, label, selected, onPress }: Props) {
  return (
    <Tag
      emoji={emoji}
      label={label}
      onPress={onPress}
      selected={selected}
    />
  );
}
