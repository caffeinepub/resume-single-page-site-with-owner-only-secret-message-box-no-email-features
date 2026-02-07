// Deployment-specific configuration
// Use environment variables with sensible defaults

export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Resume',
  ownerName: import.meta.env.VITE_OWNER_NAME || 'Hatem Alsakhboori',
};
