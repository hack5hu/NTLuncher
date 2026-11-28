export interface AppItemProps {
  label: string;
  packageName: string;
  index: number;
  customLabel?: string;
  isRenamed?: boolean;
  isWorkApp?: boolean;
  isDualApp?: boolean;
  isHidden?: boolean;
}
