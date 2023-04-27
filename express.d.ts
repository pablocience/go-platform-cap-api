declare global {
  namespace Express {
    interface Request {
      auth: {
        iss: 'https://dev-q3kl6nfg307ghugl.us.auth0.com/';
        sub: '7e5bPt6tCb8w5Dwe0V2jY74MjJYEcrIZ@clients';
        aud: 'https://go-enrich-dev-auth.cience.com';
        iat: 1678751122;
        exp: 1678837522;
        azp: '7e5bPt6tCb8w5Dwe0V2jY74MjJYEcrIZ';
        gty: 'client-credentials';
      };
      user: {
        jwt: string;
        email: 'example@cience.com';
        id: 'auth0|6306319daed6ce0708167db8';
        iss: 'https://dev-cienc-auth.us.auth0.com/';
        sub: 'auth0|6306319daed6ce0708167db8';
        aud: ['https://dev-cienc-jwt/', 'https://dev-cienc-auth.us.auth0.com/userinfo'];
        iat: 1682389887;
        exp: 1682476287;
        azp: 'zwdzDT7FRJbktztBuJutbwlg5gDs49To';
        scope: 'openid profile email manage:client manage:tenant manage:user use:GOPlatform view:client view:tenant view:user';
        org_id: 'org_4nbjGJUkcx85fXRNJ';
        permissions: [
          'manage:client',
          'manage:tenant',
          'manage:user',
          'use:GOPlatform',
          'view:client',
          'view:tenant',
          'view:user'
        ];
      };
      // user: {
      //   id: 'auth0|1234567890';
      //   email: 'john.doe@example.com';
      //   email_verified: true;
      //   name: 'John Doe';
      //   given_name: 'John';
      //   family_name: 'Doe';
      //   nickname: 'johndoe';
      //   picture: 'https://example.com/johndoe.png';
      //   created_at: '2019-01-01T00:00:00.000Z';
      //   updated_at: '2019-01-01T00:00:00.000Z';
      //   last_login: '2019-01-01T00:00:00.000Z';
      //   logins_count: 10;
      //   blocked: false;
      //   roles: ['user'];
      //   permissions: ['read', 'write'];
      //   custom_field: 'value';
      // };
    }
  }
}
export {};
