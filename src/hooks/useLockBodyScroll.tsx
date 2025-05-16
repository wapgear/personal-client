import { useLayoutEffect } from 'react';

type LayoutFunc = () => void;

export function useLockBodyScroll(isOpen: boolean) {
  useLayoutEffect((): LayoutFunc => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => (document.body.style.overflow = originalStyle);
  }, [isOpen]);
}
