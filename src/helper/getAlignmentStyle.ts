export const getAlignmentStyle = (horizontal: string, vertical: string) => {
  const style: any = {
    position: 'absolute',
    borderRadius: 10,
    padding: 10,
  };

  // Vertical alignment
  if (vertical === 'Top') style.top = 20;
  else if (vertical === 'Center') style.top = '50%';
  else if (vertical === 'Bottom') style.bottom = 20;

  // Horizontal alignment
  if (horizontal === 'Left') style.left = 20;
  else if (horizontal === 'Center') style.left = '50%';
  else if (horizontal === 'Right') style.right = 20;

  // Optional: center transform for perfect centering
  if (horizontal === 'Center') style.transform = [{translateX: -75}];
  if (vertical === 'Center') {
    if (!style.transform) style.transform = [];
    style.transform.push({translateY: -75});
  }

  return style;
};
