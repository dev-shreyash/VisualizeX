import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest preset to handle TypeScript
  testEnvironment: 'node', // You can change this to 'jsdom' for front-end testing
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Ensure ts files are transformed with ts-jest
  },
  // Optionally, you can configure timeout for the tests
  testTimeout: 30000, // 30 seconds (adjust as needed)
};

export default config;
