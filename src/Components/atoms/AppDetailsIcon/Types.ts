import {ImageSourcePropType} from 'react-native';
import {AppItemProps} from '../../../Type';

export interface AppDetailsProps {
  image: ImageSourcePropType;
  onPress: (item: AppItemProps) => void;
  item: AppItemProps;
  label: string;
}
