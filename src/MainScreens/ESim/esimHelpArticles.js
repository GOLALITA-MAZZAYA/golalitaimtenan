export const HELP_CATEGORIES = [
  {
    id: 'installation',
    titleKey: 'ESimHelp.catInstallation',
    articles: [
      'iosInstallNow',
      'iosQr',
      'androidQr',
      'manualIos',
      'manualAndroid',
      'whichNetwork',
      'whenPlanStarts',
      'canDelete',
    ],
  },
  {
    id: 'compatibility',
    titleKey: 'ESimHelp.catCompatibility',
    articles: [
      'searchDevices',
      'iosDevices',
      'androidDevices',
      'howToKnow',
    ],
  },
  {
    id: 'faq',
    titleKey: 'ESimHelp.catFaq',
    articles: [
      'whatIsEsim',
      'physicalSim',
      'remainingData',
      'whenTopup',
      'howFarAdvance',
      'reinstallOtherDevice',
    ],
  },
  {
    id: 'troubleshooting',
    titleKey: 'ESimHelp.catTroubleshooting',
    articles: [
      'noData',
      'unableActivateIos',
      'slowSpeeds',
      'roamingIos',
      'roamingAndroid',
      'codeNoLongerValid',
      'iosChecklist',
      'pixelChecklist',
      'samsungChecklist',
    ],
  },
  {
    id: 'hotspot',
    titleKey: 'ESimHelp.catHotspot',
    articles: ['hotspotIos', 'hotspotAndroid'],
  },
];

export const HELP_SPECIAL = {
  searchDevices: 'devices',
};

export const getHelpCategory = id =>
  HELP_CATEGORIES.find(item => item.id === id) || null;
