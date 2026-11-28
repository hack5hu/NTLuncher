/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import App from '../App';

test('renders correctly', () => {
  let renderer: any;
  act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(renderer).toBeDefined();
  act(() => {
    renderer.unmount();
  });
});





