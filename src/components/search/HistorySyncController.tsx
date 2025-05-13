import { FC, useEffect } from 'react';
import { historySync } from '@/middleware';

interface HistorySyncControllerProps {
  enabled?: boolean;
}

const HistorySyncController: FC<HistorySyncControllerProps> = ({ enabled = true }) => {
  useEffect(() => {
    if (enabled) {
      historySync.enable();
    } else {
      historySync.disable();
    }
    return () => {
      historySync.disable();
    };
  }, [enabled]);
  return null;
};
export default HistorySyncController; 