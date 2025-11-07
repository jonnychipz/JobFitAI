import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import { config } from '@/config';

export const msalConfig: Configuration = {
  auth: {
    clientId: config.msal.clientId,
    authority: `https://login.microsoftonline.com/${config.msal.tenantId}`,
    redirectUri: config.msal.redirectUri,
    postLogoutRedirectUri: config.msal.redirectUri,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

export const apiRequest = {
  scopes: [`api://${config.msal.clientId}/access_as_user`],
};
