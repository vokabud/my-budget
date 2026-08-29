export const reorder = <T>(
  items: readonly T[],
  sourceIndex: number,
  destinationIndex: number,
): T[] => {
  const reordered = [...items];
  const [item] = reordered.splice(sourceIndex, 1);
  reordered.splice(destinationIndex, 0, item);
  return reordered;
};
