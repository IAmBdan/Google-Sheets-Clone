export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/src/tests/**/*.ts', '**/?(*.)+(spec|test).ts'],
    testEnvironmentOptions: {
      customExportConditions: ['react-server', 'node', 'node-addons'],
    },
  };
  