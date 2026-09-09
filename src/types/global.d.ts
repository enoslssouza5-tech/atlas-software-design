export {};

declare global {
  interface Window {
    /** sinalizado quando o motion sobe — desarma o failsafe do <head> */
    __atlasReady?: boolean;
    __atlasFailsafe?: number;
  }
}
