export interface AppItemProps {
  label: string;
  packageName: string;
  index:number;
}
export interface AppListProps {
  item: AppItemProps;
  onPress: (item: AppItemProps) => void;
  onLongPress?: (item: AppItemProps, index:number) => void;
  index?: number;
}

export interface AppDetailsProps {
  image: ImageSourcePropType;
  onPress: (item: AppItemProps) => void;
  item: AppItemProps;
  label: string;
}
