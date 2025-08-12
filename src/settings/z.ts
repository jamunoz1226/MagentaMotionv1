export const zIndex = {
  base: 0,
  tooltip: 30,
  banner: 35,
  modal: 50,
} as const;

export type ZIndexToken = keyof typeof zIndex;
