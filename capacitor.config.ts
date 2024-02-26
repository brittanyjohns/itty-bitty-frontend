import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'first_list',
  webDir: 'dist',
  loggingBehavior: 'production',
  // bundledWebRuntime: false,
  server: {
    // androidScheme: 'https',
    allowNavigation: ['*'],
    // androidScheme: 'http',
    // hostname: '10.0.2.2',
    // url: 'http://192.168.254.1:8100',
    cleartext: true
  }
};

export default config;
