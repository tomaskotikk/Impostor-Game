/**
 * Sound Effects Utility
 * Generates simple sound effects using Web Audio API (no dependencies)
 * All sounds are generated procedurally for minimal overhead
 */

type AudioContext = (typeof window)['AudioContext'] extends undefined
  ? typeof OfflineAudioContext
  : typeof window['AudioContext'];

let audioContextInstance: InstanceType<AudioContext> | null = null;
let globalMuted = false;

function getAudioContext(): InstanceType<AudioContext> | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioContextInstance) {
    const ctx = typeof window !== 'undefined' 
      ? (window.AudioContext || (window as any).webkitAudioContext)
      : null;
    if (ctx) {
      audioContextInstance = new ctx();
    }
  }
  return audioContextInstance;
}

/**
 * Play a simple beep sound
 * @param frequency Frequency in Hz (default 800)
 * @param duration Duration in seconds (default 0.1)
 * @param volume Volume 0-1 (default 0.3)
 */
export function playBeep(frequency = 800, duration = 0.1, volume = 0.3) {
  if (globalMuted) return;
  
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Sound playback failed:', e);
  }
}

/**
 * Play a "join" sound - ascending two notes
 */
export function playSoundJoin() {
  playBeep(600, 0.1, 0.25);
  setTimeout(() => playBeep(800, 0.1, 0.25), 80);
}

/**
 * Play a "leave/kick" sound - descending notes
 */
export function playSoundLeave() {
  playBeep(800, 0.1, 0.25);
  setTimeout(() => playBeep(600, 0.15, 0.25), 80);
}

/**
 * Play a "success" sound - three ascending notes
 */
export function playSoundSuccess() {
  playBeep(600, 0.08, 0.3);
  setTimeout(() => playBeep(800, 0.08, 0.3), 100);
  setTimeout(() => playBeep(1000, 0.12, 0.3), 200);
}

/**
 * Play a "game start" sound - triumphant chord-like effect
 */
export function playSoundGameStart() {
  playBeep(400, 0.15, 0.2);
  setTimeout(() => playBeep(600, 0.15, 0.2), 50);
  setTimeout(() => playBeep(800, 0.2, 0.2), 100);
}

/**
 * Play a "voting phase" sound - urgent beeping
 */
export function playSoundVoting() {
  playBeep(900, 0.06, 0.25);
  setTimeout(() => playBeep(900, 0.06, 0.25), 100);
  setTimeout(() => playBeep(900, 0.08, 0.25), 200);
}

/**
 * Play an "error" sound - low frequency buzz
 */
export function playSoundError() {
  playBeep(300, 0.2, 0.2);
  setTimeout(() => playBeep(250, 0.15, 0.2), 150);
}

/**
 * Play a "notification" sound - single pleasant beep
 */
export function playSoundNotification() {
  playBeep(750, 0.12, 0.25);
}

/**
 * Play a "winner" sound - ascending arpeggio
 */
export function playSoundWinner() {
  playBeep(523, 0.1, 0.3);  // C5
  setTimeout(() => playBeep(659, 0.1, 0.3), 100);  // E5
  setTimeout(() => playBeep(784, 0.1, 0.3), 200);  // G5
  setTimeout(() => playBeep(1047, 0.15, 0.3), 300);  // C6
}

/**
 * Play a "loser" sound - descending notes
 */
export function playSoundLoser() {
  playBeep(784, 0.1, 0.25);   // G5
  setTimeout(() => playBeep(659, 0.1, 0.25), 100);  // E5
  setTimeout(() => playBeep(523, 0.15, 0.25), 200); // C5
}

/**
 * Global mute control
 */
export function setSoundMuted(muted: boolean) {
  globalMuted = muted;
  localStorage.setItem('game-sound-muted', JSON.stringify(muted));
}

export function getSoundMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return globalMuted;
}

export function toggleSound() {
  setSoundMuted(!globalMuted);
  return !globalMuted;
}

/**
 * Wrapper function to respect mute setting
 */
function playSound(soundFn: () => void) {
  if (!globalMuted && !getSoundMuted()) {
    soundFn();
  }
}

// Export wrapped versions
export const sound = {
  join: () => playSound(playSoundJoin),
  leave: () => playSound(playSoundLeave),
  success: () => playSound(playSoundSuccess),
  gameStart: () => playSound(playSoundGameStart),
  voting: () => playSound(playSoundVoting),
  error: () => playSound(playSoundError),
  notification: () => playSound(playSoundNotification),
  winner: () => playSound(playSoundWinner),
  loser: () => playSound(playSoundLoser),
};
