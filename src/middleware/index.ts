import { createMiddleware } from './createMiddleware';
import filterService from './FilterService';
import urlSyncManager from './UrlSyncManager';
import queryTracker from './QueryTracker';
import historySync from './HistorySync';
import { ActionConfig, actionConfig } from './actionConfig';

export {
  createMiddleware,
  filterService,
  urlSyncManager,
  queryTracker,
  historySync,
  actionConfig
};

export type { ActionConfig };

export default createMiddleware; 