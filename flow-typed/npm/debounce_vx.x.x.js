declare module 'debounce' {
  declare export function debounce<T: function>(T, number, ?boolean): () => void 
}