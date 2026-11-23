/**
 * @format
 */

import React from 'react';
import ReactTestRenderer, {act} from 'react-test-renderer';
import App from '../App';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('renders correctly', async () => {
  let renderer: any;
  await act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(renderer).toBeDefined();
});
