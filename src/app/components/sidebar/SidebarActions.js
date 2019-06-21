export const BLOCK_SIDEBAR = 'BLOCK_SIDEBAR',
  UNBLOCK_SIDEBAR = 'UNBLOCK_SIDEBAR';

export function blockSidebar() {
  return {
    type: BLOCK_SIDEBAR
  };
}

export function unblockSidebar() {
  return {
    type: UNBLOCK_SIDEBAR
  };
}
