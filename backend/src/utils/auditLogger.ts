import { dbStore } from '../models/store';
import { ISecurityLog } from '../types';

export const logSecurityEvent = (
  action: string,
  actorEmail: string,
  actorRole: string,
  details: string,
  ip: string = '127.0.0.1'
) => {
  const log: ISecurityLog = {
    id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    action,
    actorEmail,
    actorRole,
    ip,
    details,
    createdAt: new Date().toISOString(),
  };

  dbStore.securityLogs = [log, ...dbStore.securityLogs];
};
