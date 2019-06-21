/**
 * Created by griga on 11/17/16.
 */

export const NAVIGATION_INIT = 'NAVIGATION_INIT';
export const NAVIGATION_REFRESH = 'NAVIGATION_REFRESH';

export function navigationInit(items) {
  return (dispatch) => {
    return dispatch({
      type: NAVIGATION_INIT,
      items
    });
  };
}

export function refresh(lastUpdate) {
  return (dispatch) => {
    return dispatch({
      type: NAVIGATION_REFRESH,
      refresh: lastUpdate
    });
  };
}
