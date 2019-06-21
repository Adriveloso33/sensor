import { INIT_PROCESS, FINISH_PROCESS, RESET_SCHEDULER } from './SchedulerActions';

const INITIAL_STATE = { processQueue: [] };

export default function schedulerReducer(state = INITIAL_STATE, action) {
  const { id, type } = action;
  switch (type) {
    case INIT_PROCESS:
      return {
        processQueue: state.processQueue.concat([id]),
      };

    case FINISH_PROCESS:
      return {
        processQueue: state.processQueue.filter((pid) => pid !== id),
      };

    case RESET_SCHEDULER:
      return {
        processQueue: [],
      };

    default:
      return state;
  }
}
