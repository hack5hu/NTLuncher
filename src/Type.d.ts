export interface AppItemProps {
  label: string;
  packageName: string;
  index: number;
  customLabel?: string;
  isRenamed?: boolean;
  isWorkApp?: boolean;
  isDualApp?: boolean;
}
// Component-specific prop types moved into their folders under Types.ts
