module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // MICRO SERVIÇOS
    NEXT_APP_URL_MS_AUTH: process.env.NEXT_APP_URL_MS_AUTH,
    HOST_API_KEY: process.env.NEXT_APP_URL_MS_AUTH,
    NEXT_APP_URL_MS_PARTNER: process.env.NEXT_APP_URL_MS_PARTNER,
    NEXT_APP_URL_MS_CATALOG: process.env.NEXT_APP_URL_MS_CATALOG,
    NEXT_APP_URL_MS_LOGISTICS: process.env.NEXT_APP_URL_MS_LOGISTICS,
    NEXT_APP_URL_MS_BILLING: process.env.NEXT_APP_URL_MS_BILLING,
    NEXT_APP_URL_MS_ORDER: process.env.NEXT_APP_URL_MS_ORDER,
    NEXT_APP_URL_MS_COMMUNICATION: process.env.NEXT_APP_URL_MS_COMMUNICATION,
    NEXT_APP_GOOGLE_API_KEY: process.env.NEXT_APP_GOOGLE_API_KEY,
    NEXT_APP_PAGSEGURO_CONNECT_URL: process.env.NEXT_APP_PAGSEGURO_CONNECT_URL,
    NEXT_APP_PAGSEGURO_CONNECT_SCOPE: process.env.NEXT_APP_PAGSEGURO_CONNECT_SCOPE,
    NEXT_APP_PAGSEGURO_CONNECT_CLIENT_ID: process.env.NEXT_APP_PAGSEGURO_CONNECT_CLIENT_ID,
    NEXT_APP_PAGSEGURO_REDIRECT_URL: process.env.NEXT_APP_PAGSEGURO_REDIRECT_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minio.laveai.app',
        port: '9000',
      },
    ],
  },
};
