import React from 'react';
import RenameRow from '../../molecules/RenameRow/RenameRow';
import DefaultActionsRow from '../../molecules/DefaultActionsRow/DefaultActionsRow';
import {AppItemProps} from '../../../Type';

interface AppItemActionsProps {
  item: AppItemProps;
  isRenaming: boolean;
  rename: string;
  setRename: (name: string) => void;
  saveRename: (item: AppItemProps) => void;
  handleRename: (item: AppItemProps) => void;
  handleInfo: (item: AppItemProps) => void;
  handleDelete: (item: AppItemProps) => void;
  closeActions: () => void;
}

const AppItemActions: React.FC<AppItemActionsProps> = props => {
  return props.isRenaming ? (
    <RenameRow
      item={props.item}
      rename={props.rename}
      setRename={props.setRename}
      handleRename={props.saveRename}
      closeActions={props.closeActions}
    />
  ) : (
    <DefaultActionsRow
      item={props.item}
      handleRename={props.handleRename}
      handleInfo={props.handleInfo}
      handleDelete={props.handleDelete}
      closeActions={props.closeActions}
    />
  );
};

export default AppItemActions;
