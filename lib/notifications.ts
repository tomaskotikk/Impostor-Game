/**
 * Toast Notification Utilities
 * Uses Sonner for beautiful toast notifications
 * Sound effects are handled separately via sound-effects.ts
 */

import { toast } from 'sonner';
import { sound } from './sound-effects';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  sound?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a success notification
 */
export function notifySuccess(message: string, options?: ToastOptions) {
  if (options?.sound !== false) sound.success();
  return toast.success(message, {
    duration: options?.duration || 4000,
    action: options?.action,
  });
}

/**
 * Show an error notification
 */
export function notifyError(message: string, options?: ToastOptions) {
  if (options?.sound !== false) sound.error();
  return toast.error(message, {
    duration: options?.duration || 5000,
    action: options?.action,
  });
}

/**
 * Show an info notification
 */
export function notifyInfo(message: string, options?: ToastOptions) {
  if (options?.sound !== false) sound.notification();
  return toast.info(message, {
    duration: options?.duration || 4000,
    action: options?.action,
  });
}

/**
 * Show a warning notification
 */
export function notifyWarning(message: string, options?: ToastOptions) {
  if (options?.sound !== false) sound.notification();
  return toast.info(message, {
    duration: options?.duration || 4000,
    action: options?.action,
  });
}

/**
 * Game-specific notifications
 */

export function notifyPlayerJoined(playerName: string) {
  sound.join();
  toast.success(`${playerName} se připojil do hry`, {
    duration: 3000,
  });
}

export function notifyPlayerLeft(playerName: string) {
  sound.leave();
  toast.info(`${playerName} opustil hru`, {
    duration: 3000,
  });
}

export function notifyPlayerKicked(playerName: string) {
  sound.error();
  toast.error(`${playerName} byl vyhozen z hry`, {
    duration: 4000,
  });
}

export function notifyGameStarting(categoryName: string) {
  sound.gameStart();
  toast.success(`Hra začína! Kategorie: ${categoryName}`, {
    duration: 3500,
  });
}

export function notifyVotingPhase() {
  sound.voting();
  toast.info('Fáze hlasování! Hlasujte nyní!', {
    duration: 5000,
  });
}

export function notifyRoundEnding() {
  sound.voting();
  toast.warning('Hlasování končí za 5 sekund...', {
    duration: 3000,
  });
}

export function notifyGameEnded(impostorName: string, wasSuccessful: boolean) {
  if (wasSuccessful) {
    sound.winner();
    toast.success(`Hra skončila! Impostor: ${impostorName}`, {
      duration: 5000,
    });
  } else {
    sound.loser();
    toast.error(`Hra skončila! Impostor: ${impostorName} vyhrál!`, {
      duration: 5000,
    });
  }
}

export function notifyYouAreImpostor() {
  sound.gameStart();
  toast.success('Ty jsi IMPOSTOR! Vymýšlej slovo a klaměj!', {
    duration: 4000,
  });
}

export function notifyYouAreCitizen(word: string) {
  sound.success();
  toast.info(`Tvoje slovo: "${word}"`, {
    duration: 4000,
  });
}

export function notifyRoomCodeCopied() {
  sound.notification();
  toast.success('Kód místnosti zkopírován do schránky!', {
    duration: 2500,
  });
}

export function notifyConnectionError() {
  sound.error();
  toast.error('Chyba připojení! Zkuste to znovu.', {
    duration: 5000,
  });
}

export function notifyInvalidInput(message: string) {
  sound.error();
  toast.error(message, {
    duration: 4000,
  });
}

export function notifyNicknameToLong() {
  sound.error();
  toast.error('Nick může mít maximálně 16 znaků!', {
    duration: 4000,
  });
}

export function notifyNotEnoughWords(required: number) {
  sound.error();
  toast.error(`Musíš zadat alespoň ${required} vlastních slov!`, {
    duration: 4000,
  });
}

export function notifyMustSelectCategory() {
  sound.error();
  toast.error('Vyber kategorii nebo zadej vlastní slova!', {
    duration: 4000,
  });
}

export function notifyRoomDeleted() {
  sound.notification();
  toast.info('Místnost byla smazána - všichni hráči opustili', {
    duration: 3500,
  });
}

export function notifyYouWereKicked() {
  sound.leave();
  toast.error('Byl jsi vyhozen z místnosti!', {
    duration: 5000,
  });
}

export function notifyWaitingForOtherPlayers(count: number) {
  toast.info(`Čekáme na ${count} ${count === 1 ? 'hráče' : 'hráče'}...`, {
    duration: 4000,
  });
}
