"use client";

import { useSyncExternalStore } from "react";

/**
 * Pequena store de preferência do usuário persistida em `localStorage`.
 *
 * Usa `useSyncExternalStore` em vez de `useState` + `useEffect` porque o valor
 * real só existe no navegador: assim o React faz a hidratação com o valor do
 * servidor e troca para o valor salvo sem renderizações em cascata.
 * De brinde, a preferência fica sincronizada entre abas (evento `storage`).
 */
export type PersistedStore<T extends string> = {
  set: (value: T) => void;
  useValue: () => T;
};

export function createPersistedStore<T extends string>(options: {
  /** Chave usada no localStorage. */
  key: string;
  /** Valor usado na renderização do servidor (e na hidratação). */
  serverValue: T;
  /** Valor inicial no cliente quando ainda não há preferência salva. */
  detect: () => T;
  isValid: (value: string) => value is T;
  /** Efeito aplicado no documento sempre que o valor muda. */
  apply?: (value: T) => void;
}): PersistedStore<T> {
  const listeners = new Set<() => void>();
  let cache: T | null = null;

  function emit() {
    for (const listener of listeners) listener();
  }

  function read(): T {
    if (cache !== null) return cache;
    try {
      const stored = window.localStorage.getItem(options.key);
      cache = stored !== null && options.isValid(stored) ? stored : options.detect();
    } catch {
      cache = options.detect();
    }
    return cache;
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== options.key) return;
    cache = null;
    emit();
  }

  function subscribe(listener: () => void) {
    if (listeners.size === 0) window.addEventListener("storage", onStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) window.removeEventListener("storage", onStorage);
    };
  }

  function set(value: T) {
    cache = value;
    try {
      window.localStorage.setItem(options.key, value);
    } catch {
      /* modo privativo ou storage bloqueado: a preferência vale só para esta sessão */
    }
    options.apply?.(value);
    emit();
  }

  return {
    set,
    useValue: () => useSyncExternalStore(subscribe, read, () => options.serverValue),
  };
}
