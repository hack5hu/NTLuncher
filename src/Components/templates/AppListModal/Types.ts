import {AppItemProps} from '../../../Type';

export interface AppListModalProps {
  /** Unused — kept for caller compatibility; modal manages its own gestures */
  panResponder?: unknown;
  onAppSelect: (item: AppItemProps) => void;
  closeModal: () => void;
  onLongPress?: () => void;
  isModalVisible: boolean;
  fromSettingsModal?: boolean;
  initialShowHidden?: boolean;
}
