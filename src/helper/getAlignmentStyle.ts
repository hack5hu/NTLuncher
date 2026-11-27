export const getAlignmentStyle = (horizontal: string, vertical: string) => {
  const style: any = {
    position: 'absolute',
    borderRadius: 10,
    paddingHorizontal: 10,
  };

  // Vertical alignment
  if (vertical === 'Top') {
    style.top = 100;
  } else if (vertical === 'Center') {
    style.top = '50%';
    style.transform = [{translateY: -160}];
  } else if (vertical === 'Bottom') {
    style.bottom = 40;
  }

  // Horizontal alignment
  if (horizontal === 'Left') {
    style.left = 10;
    style.alignItems = 'flex-start';
  } else if (horizontal === 'Center') {
    style.left = 0;
    style.right = 0;
    style.alignItems = 'center';
  } else if (horizontal === 'Right') {
    style.right = 10;
    style.alignItems = 'flex-end';
  }

  return style;
};

