// Client-side interactive tool runtime helpers
export interface InteractiveTool {
  init: () => void;
  destroy?: () => void;
}
