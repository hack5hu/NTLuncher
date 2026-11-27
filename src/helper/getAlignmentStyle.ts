export interface Insets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export const getAlignmentStyle = (
  horizontal: string,
  vertical: string,
  insets?: Insets,
) => {
  const topInset = insets?.top ?? 36;
  const bottomInset = insets?.bottom ?? 24;
  const leftInset = insets?.left ?? 0;
  const rightInset = insets?.right ?? 0;

  const style: any = {
    position: 'absolute',
    borderRadius: 10,
    paddingHorizontal: 10,
  };

  // Vertical alignment
  if (vertical === 'Top') {
    style.top = topInset + 80;
  } else if (vertical === 'Center') {
    style.top = '50%';
    style.transform = [{translateY: -160}];
  } else if (vertical === 'Bottom') {
    style.bottom = Math.max(bottomInset + 16, 32);
  }

  // Horizontal alignment
  if (horizontal === 'Left') {
    style.left = leftInset + 10;
    style.alignItems = 'flex-start';
  } else if (horizontal === 'Center') {
    style.left = 0;
    style.right = 0;
    style.alignItems = 'center';
  } else if (horizontal === 'Right') {
    style.right = rightInset + 10;
    style.alignItems = 'flex-end';
  }

  return style;
};


