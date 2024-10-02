import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// Allows us to easily load external libraries only when they are needed.
// Adapted from: https://usehooks.com/useScript/ (not provided as a library)
// Modified slightly for TS

export enum ScriptStatus {
  LOADING = 'loading',
  IDLE = 'idle',
  READY = 'ready',
  ERROR = 'error',
}

export const useScript = (src: string): ScriptStatus => {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<ScriptStatus>(src ? ScriptStatus.LOADING : ScriptStatus.IDLE);

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src || !document || !window) {
        setStatus(ScriptStatus.IDLE);
        return;
      }

      // Fetch existing script element by src
      // It may have been added by another instance of this hook
      const script: HTMLElementTagNameMap['script'] = getScript(src, setStatus);

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent: EventListenerOrEventListenerObject = (event) => {
        setStatus(event.type === 'load' ? ScriptStatus.READY : ScriptStatus.ERROR);
      };

      // Add event listeners
      script.addEventListener('load', setStateFromEvent);
      script.addEventListener('error', setStateFromEvent);

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener('load', setStateFromEvent);
          script.removeEventListener('error', setStateFromEvent);
        }
      };
    },
    [src], // Only re-run effect if script src changes
  );

  return status;
};

const getScript = (src: string, setStatus: Dispatch<SetStateAction<ScriptStatus>>): HTMLElementTagNameMap['script'] => {
  // Fetch existing script element by src
  // It may have been added by another instance of this hook
  const existingScript: HTMLElementTagNameMap['script'] | null = document?.querySelector(`script[src="${src}"]`);

  if (existingScript) {
    // Grab existing script status from attribute and set to state.
    const status: string | null = existingScript.getAttribute('data-status');
    setStatus(
      status && Object.values<string>(ScriptStatus).includes(status) ? (status as ScriptStatus) : ScriptStatus.LOADING,
    );
    return existingScript;
  }

  // Create script
  const createdScript = document?.createElement('script');
  createdScript.src = src;
  createdScript.async = true;
  createdScript.setAttribute('data-status', ScriptStatus.LOADING);
  // Add script to document body
  document?.body?.appendChild(createdScript);

  // Store status in attribute on script
  // This can be read by other instances of this hook
  const setAttributeFromEvent: EventListenerOrEventListenerObject = (event) => {
    createdScript.setAttribute('data-status', event.type === 'load' ? ScriptStatus.READY : ScriptStatus.ERROR);
  };

  createdScript.addEventListener('load', setAttributeFromEvent);
  createdScript.addEventListener('error', setAttributeFromEvent);
  return createdScript;
};
