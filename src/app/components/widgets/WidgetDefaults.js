export default {
  grid: 'article',
  widgets: '.jarviswidget',
  localStorage: false,
  deleteSettingsKey: '#deletesettingskey-options',
  settingsKeyLabel: 'Reset settings?',
  deletePositionKey: '#deletepositionkey-options',
  positionKeyLabel: 'Reset position?',
  sortable: false,
  buttonsHidden: false,

  // toggle button
  toggleButton: true,
  toggleClass: 'fa fa-minus | fa fa-plus',
  toggleSpeed: 200,
  onToggle: () => {},

  // delete btn
  deleteButton: true,
  deleteMsg: 'Warning: This action cannot be undone!',
  deleteClass: 'fa fa-times',
  deleteSpeed: 200,
  onDelete: () => {},

  // edit btn
  editButton: true,
  editPlaceholder: '.jarviswidget-editbox',
  editClass: 'fa fa-cog | fa fa-save',
  editSpeed: 200,
  onEdit: () => {},

  // color button
  colorButton: true,

  // full screen
  fullscreenButton: true,
  fullscreenClass: 'fa fa-expand | fa fa-compress',
  fullscreenDiff: 3,
  onFullscreen: (jElement) => {
    if ($('#jarviswidget-fullscreen-mode').length !== 0) {
      // fire
      $(window).trigger('fullscreenWidget', jElement);
    } else {
      $(window).trigger('normalWidget', jElement);
    }

    const elem = jElement.find('.widget-body').first();
    elem.hide(0, () => {
      elem.fadeTo(1000, 1, () => {});
    });
  },

  // custom btn
  customButton: true,
  customClass: 'fa fa-arrow-up | fa fa-compress',
  customStart: () => {},
  customEnd: () => {},

  // expandbutton
  // order
  buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
  opacity: 1.0,
  dragHandle: '> header',
  placeholderClass: 'jarviswidget-placeholder',
  indicator: true,
  indicatorTime: 600,
  ajax: true,
  timestampPlaceholder: '.jarviswidget-timestamp',
  timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
  refreshButton: true,
  refreshButtonClass: 'fa fa-refresh',
  labelError: 'Sorry but there was a error:',
  labelUpdated: 'Last Update:',
  labelRefresh: 'Refresh',
  labelDelete: 'Delete widget:',
  afterLoad: () => {},
  rtl: false, // best not to toggle this!
  onChange: () => {},
  onSave: () => {},
  ajaxnav: true,
};
