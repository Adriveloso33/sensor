export const INIT_PROCESS = 'INIT_PROCESS',
  FINISH_PROCESS = 'FINISH_PROCESS',
  RESET_SCHEDULER = 'RESET_SCHEDULER';

export function initProcess(processId) {
  return {
    type: INIT_PROCESS,
    id: processId
  };
}

export function finishProcess(processId) {
  return {
    type: FINISH_PROCESS,
    id: processId
  };
}

export function resetScheduler() {
  return {
    type: RESET_SCHEDULER
  };
}
