import {AppItemProps} from '../../../Type';

export interface AppListProps {
  item: AppItemProps;
  onPress: (item: AppItemProps) => void;
  onLongPress?: (item: AppItemProps, index: number | undefined) => void;
  index?: number;
}
