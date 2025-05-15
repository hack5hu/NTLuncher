export interface AppItemProps {
  label: string;
  packageName: string;
  index: number;
  customLabel?: string;
  isRenamed?: boolean;
}
export interface AppListProps {
  item: AppItemProps;
  onPress: (item: AppItemProps) => void;
  onLongPress?: (item: AppItemProps, index: number | undefined) => void;
  index?: number;
}

export interface AppDetailsProps {
  image: ImageSourcePropType;
  onPress: (item: AppItemProps) => void;
  item: AppItemProps;
  label: string;
}
