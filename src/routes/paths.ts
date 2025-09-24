// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
export const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_RESET_PASSWORD = '/reset-password';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_RESET_PASSWORD = {
  // root: path(ROOTS_RESET_PASSWORD, '/:userToken'),
  root: (userToken: string) => path(ROOTS_RESET_PASSWORD, `/${userToken}`),
  // resetPassword: path(ROOTS_RESET_PASSWORD, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    catalog: path(ROOTS_DASHBOARD, '/catalog'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, '/file'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  chatConsumer: {
    root: path(ROOTS_DASHBOARD, '/orders/chat'),
    // new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (name: string) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
  },
  catalog: {
    root: path(ROOTS_DASHBOARD, '/catalog'),
    shop: path(ROOTS_DASHBOARD, '/catalog/shop'),
    review: path(ROOTS_DASHBOARD, '/catalog/products/review'),
    list: path(ROOTS_DASHBOARD, '/catalog/list'),
    productsList: path(ROOTS_DASHBOARD, `/catalog/products/productsList`),
    checkout: path(ROOTS_DASHBOARD, '/catalog/checkout'),
    new: path(ROOTS_DASHBOARD, '/catalog/products/new'),
    view: (name: string) => path(ROOTS_DASHBOARD, `/catalog/products/${name}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/catalog/products/${id}/edit`),
    demoView: path(ROOTS_DASHBOARD, '/catalog/products/nike-air-force-1-ndestrukt'),
  },
  area: {
    root: path(ROOTS_DASHBOARD, '/area'),
    branchList: path(ROOTS_DASHBOARD, '/area/points/branchList'),
    new: path(ROOTS_DASHBOARD, '/area/points/components/new'),
    view: (id: string) => path(ROOTS_DASHBOARD, `/points/${id}`),
    edit: (id: string) => path(ROOTS_DASHBOARD, `/area/points/${id}/edit`),
    areaList: path(ROOTS_DASHBOARD, '/area/actuation/areaList'),
    pointList: path(ROOTS_DASHBOARD, '/area/actuation/pointList'),
    newArea: path(ROOTS_DASHBOARD, '/area/actuation/new'),
    form: path(ROOTS_DASHBOARD, '/area/actuation/table'),
    map: path(ROOTS_DASHBOARD, '/area/actuation/map'),
    // areaListConfig: path(ROOTS_DASHBOARD, '/area/config/areaListConfig'),
    config: (areaId: string) => path(ROOTS_DASHBOARD, `/area/actuation/${areaId}/areaConfig`),
  },

  orders: {
    root: path(ROOTS_DASHBOARD, '/orders/list'),
    details: (id: string) => path(ROOTS_DASHBOARD, `/orders/${id}/orderDetails`),
  },
  collab: {
    root: path(ROOTS_DASHBOARD, '/collab/list'),
    list: path(ROOTS_DASHBOARD, '/collab/list'),
    new: path(ROOTS_DASHBOARD, '/collab/new'),
  },
  reports: {
    list: path(ROOTS_DASHBOARD, '/reports/list'),
    details: (id: string) => path(ROOTS_DASHBOARD, `/reports/${id}/details`),
  },
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
