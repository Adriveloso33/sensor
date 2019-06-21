const urlServer = 'https://10.32.250.217/entropy/backend/public';

const SmartadminConfig = {
  menu_speed: 200,

  smartSkin: 'smart-style-entropy',

  apiRootUrl: `${urlServer}/api`,
  htmlRootUrl: `${urlServer}/html`,

  apiAppKey: '76a49534d2ed2d75e9b39203afd31ab03c58358d',
  buildUrl: 'build',
  skins: [
    {
      name: 'smart-style-entropy',
      logo: 'assets/img/operators/att_white.png',
      class: 'btn btn-block btn-xs txt-color-white margin-right-5',
      style: {
        backgroundColor: '#4E463F',
        loadingIntroColor: '#d7f1c1',
      },
      label: 'Dark',
    },
    {
      name: 'smart-style-entropy-light',
      logo: 'assets/img/operators/att_black.png',
      class: 'btn btn-block btn-xs txt-color-white margin-right-5',
      style: {
        backgroundColor: '#4E463F',
        loadingIntroColor: '#597477',
      },
      label: 'Light',
    },
    {
      name: 'smart-style-entropy-pink',
      logo: 'assets/img/operators/att_white.png',
      class: 'btn btn-block btn-xs txt-color-white margin-right-5',
      style: {
        backgroundColor: '#4E463F',
        loadingIntroColor: '#b71573',
      },
      label: 'Pink',
    },
  ],
};

SmartadminConfig.sound_path = '/assets/sound/';
SmartadminConfig.sound_on = true;

/*
 * DEBUGGING MODE
 * debugState = true; will spit all debuging message inside browser console.
 * The colors are best displayed in chrome browser.
 */

SmartadminConfig.debugState = false;
SmartadminConfig.debugStyle = 'font-weight: bold; color: #00f;';
SmartadminConfig.debugStyle_green = 'font-weight: bold; font-style:italic; color: #46C246;';
SmartadminConfig.debugStyle_red = 'font-weight: bold; color: #ed1c24;';
SmartadminConfig.debugStyle_warning = 'background-color:yellow';
SmartadminConfig.debugStyle_success = 'background-color:green; font-weight:bold; color:#fff;';
SmartadminConfig.debugStyle_error = 'background-color:#ed1c24; font-weight:bold; color:#fff;';

SmartadminConfig.voice_command = true;
SmartadminConfig.voice_command_auto = false;

/*
 *  Sets the language to the default 'en-US'. (supports over 50 languages
 *  by google)
 *
 *  Afrikaans         ['af-ZA']
 *  Bahasa Indonesia  ['id-ID']
 *  Bahasa Melayu     ['ms-MY']
 *  CatalГ            ['ca-ES']
 *  ДЊeЕЎtina         ['cs-CZ']
 *  Deutsch           ['de-DE']
 *  English           ['en-AU', 'Australia']
 *                    ['en-CA', 'Canada']
 *                    ['en-IN', 'India']
 *                    ['en-NZ', 'New Zealand']
 *                    ['en-ZA', 'South Africa']
 *                    ['en-GB', 'United Kingdom']
 *                    ['en-US', 'United States']
 *  EspaГ±ol          ['es-AR', 'Argentina']
 *                    ['es-BO', 'Bolivia']
 *                    ['es-CL', 'Chile']
 *                    ['es-CO', 'Colombia']
 *                    ['es-CR', 'Costa Rica']
 *                    ['es-EC', 'Ecuador']
 *                    ['es-SV', 'El Salvador']
 *                    ['es-ES', 'EspaГ±a']
 *                    ['es-US', 'Estados Unidos']
 *                    ['es-GT', 'Guatemala']
 *                    ['es-HN', 'Honduras']
 *                    ['es-MX', 'MГ©xico']
 *                    ['es-NI', 'Nicaragua']
 *                    ['es-PA', 'PanamГЎ']
 *                    ['es-PY', 'Paraguay']
 *                    ['es-PE', 'PerГє']
 *                    ['es-PR', 'Puerto Rico']
 *                    ['es-DO', 'RepГєblica Dominicana']
 *                    ['es-UY', 'Uruguay']
 *                    ['es-VE', 'Venezuela']
 *  Euskara           ['eu-ES']
 *  FranГ§ais         ['fr-FR']
 *  Galego            ['gl-ES']
 *  Hrvatski          ['hr_HR']
 *  IsiZulu           ['zu-ZA']
 *  ГЌslenska         ['is-IS']
 *  Italiano          ['it-IT', 'Italia']
 *                    ['it-CH', 'Svizzera']
 *  Magyar            ['hu-HU']
 *  Nederlands        ['nl-NL']
 *  Norsk bokmГҐl     ['nb-NO']
 *  Polski            ['pl-PL']
 *  PortuguГЄs        ['pt-BR', 'Brasil']
 *                    ['pt-PT', 'Portugal']
 *  RomГўnДѓ          ['ro-RO']
 *  SlovenДЌina       ['sk-SK']
 *  Suomi             ['fi-FI']
 *  Svenska           ['sv-SE']
 *  TГјrkГ§e          ['tr-TR']
 *  Р±СЉР»РіР°СЂСЃРєРё['bg-BG']
 *  PСѓСЃСЃРєРёР№     ['ru-RU']
 *  РЎСЂРїСЃРєРё      ['sr-RS']
 *  н•њкµ­м–ґ         ['ko-KR']
 *  дё­ж–‡            ['cmn-Hans-CN', 'ж™®йЂљиЇќ (дё­е›Ѕе¤§й™†)']
 *                    ['cmn-Hans-HK', 'ж™®йЂљиЇќ (й¦™жёЇ)']
 *                    ['cmn-Hant-TW', 'дё­ж–‡ (еЏ°зЃЈ)']
 *                    ['yue-Hant-HK', 'зІµиЄћ (й¦™жёЇ)']
 *  ж—Ґжњ¬иЄћ         ['ja-JP']
 *  Lingua latД«na    ['la']
 */
SmartadminConfig.voice_command_lang = 'es-ES';
/*
 *  Use localstorage to remember on/off (best used with HTML Version)
 */
SmartadminConfig.voice_localStorage = false;
/*
 * Voice Commands
 * Defines all voice command variables and functions
 */
if (SmartadminConfig.voice_command) {
  SmartadminConfig.commands = {
    'show dashboard': {
      type: 'navigate',
      payload: '/dashboard/analytics',
    },
    'show social': {
      type: 'navigate',
      payload: '/dashboard/social-wall',
    },
    'show outlook': {
      type: 'navigate',
      payload: '/outlook',
    },
    'show graphs': {
      type: 'navigate',
      payload: '/graphs/chart-js',
    },
    'show flot chart': {
      type: 'navigate',
      payload: '/graphs/flot-charts',
    },
    'show morris chart': {
      type: 'navigate',
      payload: '/graphs/morris-charts',
    },
    'show inline chart': {
      type: 'navigate',
      payload: '/graphs/sparklines',
    },
    'show dygraphs': {
      type: 'navigate',
      payload: '/graphs/dygraphs',
    },
    'show tables': {
      type: 'navigate',
      payload: '/tables/normal',
    },
    'show data table': {
      type: 'navigate',
      payload: '/tables/datatables',
    },
    'show form': {
      type: 'navigate',
      payload: '/forms/elements',
    },
    'show form layouts': {
      type: 'navigate',
      payload: '/forms/layouts',
    },
    'show form validation': {
      type: 'navigate',
      payload: '/forms/validation',
    },
    'show form elements': {
      type: 'navigate',
      payload: '/forms/bootstrap-elements',
    },
    'show form plugins': {
      type: 'navigate',
      payload: '/forms/plugins',
    },
    'show form wizards': {
      type: 'navigate',
      payload: '/forms/wizards',
    },
    'show bootstrap editor': {
      type: 'navigate',
      payload: '/forms/editors',
    },
    'show dropzone': {
      type: 'navigate',
      payload: '/forms/dropzone',
    },
    'show image cropping': {
      type: 'navigate',
      payload: '/forms/image-cropping',
    },
    'show general elements': {
      type: 'navigate',
      payload: '/ui/general-elements',
    },
    'show buttons': {
      type: 'navigate',
      payload: '/ui/buttons',
    },
    'show fontawesome': {
      type: 'navigate',
      payload: '/ui/icons/font-awesome',
    },
    'show glyph icons': {
      type: 'navigate',
      payload: '/ui/icons/glyphicons',
    },
    'show flags': {
      type: 'navigate',
      payload: '/ui/icons/flags',
    },
    'show grid': {
      type: 'navigate',
      payload: '/ui/grid',
    },
    'show tree view': {
      type: 'navigate',
      payload: '/ui/treeviews',
    },
    'show nestable lists': {
      type: 'navigate',
      payload: '/ui/nestable-lists',
    },
    'show jquery U I': {
      type: 'navigate',
      payload: '/ui/jquery-ui',
    },
    'show typography': {
      type: 'navigate',
      payload: '/ui/typography',
    },
    'show calendar': {
      type: 'navigate',
      payload: '/calendar',
    },
    'show widgets': {
      type: 'navigate',
      payload: '/widgets',
    },
    'show gallery': {
      type: 'navigate',
      payload: '/app-views/gallery',
    },
    'show maps': {
      type: 'navigate',
      payload: '/maps',
    },
    'go back': () => {
      history.back(1);
    },
    'scroll up': () => {
      jQuery('html, body').animate({ scrollTop: 0 }, 100);
    },
    'scroll down': () => {
      jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 100);
    },
    'hide navigation': {
      type: 'layout',
      payload: 'hide navigation',
    },
    'show navigation': {
      type: 'layout',
      payload: 'show navigation',
    },
    mute: {
      type: 'sound',
      payload: 'mute',
    },
    'sound on': {
      type: 'sound',
      payload: 'sound on',
    },
    stop: {
      type: 'voice',
      payload: 'stop',
    },
    help: {
      type: 'voice',
      payload: 'help on',
    },
    'got it': {
      type: 'voice',
      payload: 'help off',
    },
    logout: {
      type: 'navigate',
      payload: '/auth/login',
    },
  };
}

export const config = SmartadminConfig;
