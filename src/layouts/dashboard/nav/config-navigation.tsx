import { Icon } from '@iconify/react';
import { PATH_DASHBOARD } from '../../../routes/paths';
import SvgColor from '../../../components/svg-color';

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  points: <Icon icon="material-symbols:pin-drop-outline" width="30" height="30" />,
  area: <Icon icon="uiw:map" width="30" height="30" />,
  item: <Icon icon="material-symbols:format-list-bulleted" width="30" height="30" />,
  chat: icon('ic_chat'),
  cart: <Icon icon="ph:shopping-cart" width="30" height="30" />,
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  point: <Icon icon="gg:pin" width="30" height="30" />,
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: <Icon icon="fluent:grid-kanban-20-regular" width="30" height="30" />,
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  newItem: <Icon icon="mdi:note-plus" width="30" height="30" />,
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  history: <Icon icon="icon-park-outline:history-query" width="30" height="30" />,
  catalog: <Icon icon="grommet-icons:catalog" width="30" height="30" />,
  store: <Icon icon="fontisto:shopping-store" width="30" height="30" />,
  myStore: <Icon icon="carbon:ibm-watson-knowledge-catalog" width="30" height="30" />,
  config: <Icon icon="uil:setting" width="30" height="30" />,
  register: <Icon icon="mdi:register-outline" width="30" height="30" />,
  management: <Icon icon="fluent-mdl2:workforce-management" width="30" height="30" />,
  reportslist: <Icon icon="ep:list" width="30" height="30" />,
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'general',
  //   items: [
  //     { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
  //     { title: 'ecommerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
  //     { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
  //     { title: 'banking', path: PATH_DASHBOARD.general.banking, icon: ICONS.banking },
  //     { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
  //     { title: 'file', path: PATH_DASHBOARD.general.file, icon: ICONS.file },
  //   ],
  // },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'Produtos e Serviços',
    items: [
      {
        title: 'Catálogo Disponível',
        path: PATH_DASHBOARD.catalog.list,
        icon: ICONS.catalog,
      },
      // {
      //   title: 'Solicitar Novo Item',
      //   path: PATH_DASHBOARD.catalog.new,
      //   icon: ICONS.newItem,
      // },
      {
        title: 'Meu Catálogo',
        path: PATH_DASHBOARD.catalog.productsList,
        icon: ICONS.myStore,
      },
    ],
  },
  {
    subheader: 'Área de Cobertura',
    items: [
      {
        title: 'Filiais',
        path: PATH_DASHBOARD.area.branchList,
        icon: ICONS.store,
      },
      {
        title: 'Área de Atuação',
        path: PATH_DASHBOARD.area.areaList,
        icon: ICONS.area,
      },
      // {
      //   title: 'Configuração ',
      //   path: PATH_DASHBOARD.area.areaListConfig,
      //   icon: ICONS.config,
      // },
    ],
  },
  {
    subheader: 'Pedidos',
    items: [
      {
        title: 'Acompanhamento',
        path: PATH_DASHBOARD.kanban,
        icon: ICONS.kanban,
      },
      {
        title: 'Histórico',
        path: PATH_DASHBOARD.orders.root,
        icon: ICONS.history,
      },
    ],
  },
  {
    subheader: 'Colaboradores',
    items: [
      {
        title: 'Gerenciamento',
        path: PATH_DASHBOARD.collab.root,
        icon: ICONS.management,
      },
    ],
  },

  // {
  //   subheader: 'Extratos e Relatórios',
  //   items: [
  //     {
  //       title: 'Relatórios',
  //       path: PATH_DASHBOARD.reports.list,
  //       icon: ICONS.reportslist,
  //     },
  //   ],
  // },
  {
    subheader: 'Suporte',
    items: [
      {
        title: 'Falar com Consumidor',
        path: PATH_DASHBOARD.chatConsumer.root,
        icon: ICONS.chat,
      },
      {
        title: 'Falar com Administrador',
        path: PATH_DASHBOARD.chat.root,
        icon: ICONS.chat,
      },
    ],
  },

  // ÁREA DE COBERTURA - NOVO TITULO E EMBAIXO FILHOS
  // {
  //   title: 'Pontos de Atuação',
  //   path: PATH_DASHBOARD.points.list,
  //   icon: ICONS.points,
  //   // children: [
  //   //   { title: 'list', path: PATH_DASHBOARD.invoice.list },
  //   //   { title: 'details', path: PATH_DASHBOARD.invoice.demoView },
  //   //   { title: 'create', path: PATH_DASHBOARD.invoice.new },
  //   //   { title: 'edit', path: PATH_DASHBOARD.invoice.demoEdit },
  //   // ],
  // },

  // // BLOG
  // {
  //   title: 'Área de Atuação',
  //   path: PATH_DASHBOARD.area.form,
  //   icon: ICONS.area,
  //   // children: [
  //   //   // { title: 'posts', path: PATH_DASHBOARD.area.posts },
  //   //   { title: 'post', path: PATH_DASHBOARD.area.demoView },
  //   //   { title: 'create', path: PATH_DASHBOARD.area.new },
  //   // ],
  // },
  // {
  //   title: 'Pedidos',
  //   path: PATH_DASHBOARD.orders.root,
  //   icon: ICONS.cart,
  // },
  // {
  //   title: 'Suporte',
  //   path: PATH_DASHBOARD.chat.root,
  //   icon: ICONS.chat,
  //   children: [{ title: 'Chat', path: PATH_DASHBOARD.chat.root }],
  // },

  // children: [
  //   { title: 'Histórico', path: PATH_DASHBOARD.orders.root },
  //   { title: 'Kanban de Pedidos', path: PATH_DASHBOARD.kanban },
  // ],

  // ORDERS

  // APP
  // // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_DASHBOARD.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">+32</Label>,
  //     },
  //     {
  //       title: 'chat',
  //       path: PATH_DASHBOARD.chat.root,
  //       icon: ICONS.chat,
  //     },
  //     {
  //       title: 'calendar',
  //       path: PATH_DASHBOARD.calendar,
  //       icon: ICONS.calendar,
  //     },
  //     {
  //       title: 'kanban',
  //       path: PATH_DASHBOARD.kanban,
  //       icon: ICONS.kanban,
  //     },
  //   ],
  // },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_DASHBOARD.permissionDenied,
  //       icon: ICONS.lock,
  //       roles: ['PART'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'menu_level_2a',
  //           path: '#/dashboard/menu_level/menu_level_2a',
  //         },
  //         {
  //           title: 'menu_level_2b',
  //           path: '#/dashboard/menu_level/menu_level_2b',
  //           children: [
  //             {
  //               title: 'menu_level_3a',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
  //             },
  //             {
  //               title: 'menu_level_3b',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
  //               children: [
  //                 {
  //                   title: 'menu_level_4a',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
  //                 },
  //                 {
  //                   title: 'menu_level_4b',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: 'item_disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },

  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'item_caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'item_external_link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //     },
  //     {
  //       title: 'blank',
  //       path: PATH_DASHBOARD.blank,
  //       icon: ICONS.blank,
  //     },
  //   ],
  // },
];

export default navConfig;
