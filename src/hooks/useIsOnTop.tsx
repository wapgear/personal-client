import { useLayoutEffect, useState } from 'react';
export function useIsOnTop(offset: number = 50): boolean {
  const [isOnTop, toggleTop] = useState<boolean>(true);

  useLayoutEffect(() => {
    const onScroll = () => {
      toggleTop(window?.pageYOffset <= offset);
    };
    window?.addEventListener('scroll', onScroll);
    return () => {
      window?.removeEventListener('scroll', onScroll);
    };
  });

  return isOnTop;
}
