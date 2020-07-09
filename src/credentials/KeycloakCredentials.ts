export interface KeycloakCredentials {
  kcUrl: string; // Keycloak URL
  username?: string;
  password?: string;
  realm?: string;
  client_id?: string;
  token?: string;
  type: 'keycloak';
}
