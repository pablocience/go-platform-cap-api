import { Request, Response } from 'express';
import { LookerPostgresConnection } from '../config/LookerPostgresConnection';
import crypto from 'crypto';
import querystring from 'querystring';
import { ILookerFeatUserInterface, ISelectQueryResult } from '../ts/interfaces';

import { config } from 'dotenv';
import axios from 'axios';
config();
const auth0Domain = process.env.AUTH0_DOMAIN as string;
const auth0Audience = process.env.AUTH0_AUDIENCE as string;
const fifteen_minutes = 60 * 60;
const dashMap: { [key: string]: number } = {
  appointments: 83,
  engagements: 84,
  emails: 79,
  calls: 80,
  linkedin: 81,
  web: 82,
  'client-overview': 434,
  'multi-account': 109,
  signal: 187,
  'actions-for-appts': 511,
  sdm: 281,
  'ms-appointments': 354,
};
function forceUnicodeEncoding(string: string) {
  return decodeURIComponent(encodeURIComponent(string));
}
export const getDashboardURLController = async (req: Request, res: Response) => {
  try {
    const database = LookerPostgresConnection.getInstance();
    const { dashboard } = req.query;
    // GET GO PLATFORM AUTHENTICATED USER
    if(!req.user || !req.user.jwt) {
        return null;
    }
    const response = await axios.get(`https://${auth0Domain}/userinfo`, {headers: { Authorization: `Bearer ${req.user.jwt}` }});
    const user_email = response.data.email;
    // GET USER FROM DIRECTUS
    const userresult = (await database.executeQuery(
      `SELECT * FROM directus_users WHERE email = '${user_email}' LIMIT 1;`
    )) as unknown as ISelectQueryResult;
    // define default value for
    const user = userresult.rows[0] as ILookerFeatUserInterface;
    let clientsResult = [] as unknown as ISelectQueryResult;
    let isAdmin = false;
    if(!user) {
      if (!req.params.clientId) {
        clientsResult = await database.executeQuery(
          `SELECT  salesloft_email_address, id, client_name FROM clients where '${user_email}' = ANY(string_to_array(client_external_accessor_emails, ','))`
      ) as unknown as ISelectQueryResult;
      } else {
        clientsResult = await database.executeQuery(
          `SELECT  salesloft_email_address, id, client_name FROM clients where id = ${req.params.clientId} AND '${user_email}' = ANY(string_to_array(client_external_accessor_emails, ','))`
        ) as unknown as ISelectQueryResult;
      }
    } else {
      // GET USER ROLE
      const roleResult = (await database.executeQuery(
        `SELECT * FROM directus_roles WHERE id = '${user.role}' LIMIT 1;`
      )) as unknown as ISelectQueryResult;
      const role = roleResult.rows[0] as { name: string };

      // CLIENTS TO SHOW
      clientsResult = (await database.executeQuery(
        `SELECT clients.id, clients.salesloft_email_address 
        FROM clients INNER JOIN clients_directus_users ON clients.salesloft_email_address IS NOT NULL 
        AND clients.id = clients_directus_users.clients_id AND clients_directus_users.directus_users_id = '${user.id}' 
        WHERE clients.active = true;`
      )) as unknown as ISelectQueryResult;
      isAdmin = [
        'Admin',
        'SuperAdmin',
        'Manager',
        'SDR QA',
        'Web Team Member',
        'Campaign Strategist',
        'QA TL',
        'SDR Manager',
      ].includes(role.name);
    }
    const clients = clientsResult.rows as Array<{ salesloft_email_address: string }>;
    if (!clients) {
      throw new Error('Clients not found');
    }



    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const url = makeUrl(
      user ?? req.user,
      isAdmin,
      dashboard as string,
      clients.map((c) => c.salesloft_email_address),
      'http://localhost:3000'
    );

    return url;
  } catch (error) {
    console.log('error: ', error);
    throw new Error('Internal server error - Looker API error: ');
  }
};
function makeNonce(len: number) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const makeUrl = (
  user: ILookerFeatUserInterface,
  isAdmin: boolean,
  wantedDash: string,
  clientEmails: unknown[],
  embed_domain: string
) => {
  const host = 'looker.cienceapps.com';
  console.log('wanted=dashboard: ', wantedDash, dashMap[wantedDash], user.email);
  // const embed_prefix = '/embed/dashboards-next/'
  // const embed_prefix_safe = '%2embed%2Fdashboards-next%2F'

  // const embed_path = `/embed/dashboards-next/${dashMap[wantedDash]}`
  const embed_path =
    '/login/embed/' +
    encodeURIComponent(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
      `/embed/dashboards-next/${dashMap[wantedDash]}?theme=dark?embed_domain=${embed_domain || process.env.APP_URL}`
    );

  const nonce = JSON.stringify(makeNonce(16));
  const time = JSON.stringify(Math.floor(new Date().getTime() / 1000));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const session_length = fifteen_minutes;

  const adminPerms = [];
  if (isAdmin) {
    adminPerms.push('embed_browse_spaces');
  }

  const permissions = JSON.stringify([
    ...adminPerms,
    'see_user_dashboards',
    'see_lookml_dashboards',
    'access_data',
    'see_looks',
    // 'schedule_external_look_emails', // Must figure out client deletion to do so
    'send_to_integration',
    'create_alerts',
    'schedule_look_emails',
    'see_drill_overlay',
    'download_with_limit',
  ]);
  const models = JSON.stringify(['Client_Data']);
  const group_ids = '[5]';
  const external_user_id = JSON.stringify(user.id);
  const external_group_id = '"cap"';
  const user_attributes = `{"email": "${user.email}", "view_all_clients": "${
    isAdmin ? 'yes' : 'no'
  }", "hide_navbar": "yes", "allowed_client_emails": ${JSON.stringify(
    (clientEmails || []).join(',').replace(/"/g, '')
  )}}`;
  const access_filters = '{}';

  let string_to_sign = '';

  string_to_sign += host + '\n';
  string_to_sign += embed_path + '\n';
  string_to_sign += nonce + '\n';
  string_to_sign += time + '\n';
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  string_to_sign += session_length + '\n';
  string_to_sign += external_user_id + '\n';
  string_to_sign += permissions + '\n';
  string_to_sign += models + '\n';
  string_to_sign += group_ids + '\n';
  string_to_sign += external_group_id + '\n';
  string_to_sign += user_attributes + '\n';
  string_to_sign += access_filters;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const signature = crypto
    .createHmac('sha1', process.env.LOOKER_SSO_SECRET as string)
    .update(forceUnicodeEncoding(string_to_sign))
    .digest('base64')
    .trim();

  const query_params = {
    nonce: nonce,
    time: time,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    session_length: session_length,
    external_user_id: external_user_id,
    permissions: permissions,
    models: models,
    access_filters: access_filters,
    first_name: JSON.stringify(user.first_name),
    last_name: JSON.stringify(user.last_name),
    group_ids: group_ids,
    external_group_id: external_group_id,
    // user_timezone: '"US/Pacific"',
    user_attributes: user_attributes,
    force_logout_login: true,
    // embed_domain: process.env.APP_URL,
    signature: signature,
  };

  const query_string = querystring.stringify(query_params);

  return `https://` + host + embed_path + '?' + query_string;
};
