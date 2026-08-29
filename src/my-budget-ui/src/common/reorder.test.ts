import { describe, expect, it } from 'vitest';

import { reorder } from './reorder';

describe('reorder', () => {
  it('moves an item without mutating the source array', () => {
    const source = ['first', 'second', 'third'];

    expect(reorder(source, 0, 2)).toEqual(['second', 'third', 'first']);
    expect(source).toEqual(['first', 'second', 'third']);
  });

  it('preserves the list when source and destination match', () => {
    expect(reorder(['first', 'second'], 1, 1)).toEqual(['first', 'second']);
  });
});
