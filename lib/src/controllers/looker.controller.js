import { LookerPostgresConnection } from '@config/LookerPostgresConnection';
import crypto from 'crypto';
import querystring from 'querystring';
import { config } from 'dotenv';
config();
const fifteen_minutes = 60 * 60;
const dashMap = {
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
function forceUnicodeEncoding(string) {
    return decodeURIComponent(encodeURIComponent(string));
}
export const getDashboardURLController = async (req, res) => {
    try {
        const database = LookerPostgresConnection.getInstance();
        const { dashboard } = req.query;
        if (!req.user || !req.user.email) {
            return res.json({ status: 401, message: 'Please, contact support.' });
        }
        const user_email = 'pablo.zarate@cience.com';
        const userresult = (await database.executeQuery(`SELECT * FROM directus_users WHERE email = '${user_email}' LIMIT 1;`));
        const user = userresult.rows[0];
        const roleResult = (await database.executeQuery(`SELECT * FROM directus_roles WHERE id = '${user.role}' LIMIT 1;`));
        const role = roleResult.rows[0];
        const clientsResult = (await database.executeQuery(`SELECT clients.id, clients.salesloft_email_address 
      FROM clients INNER JOIN clients_directus_users ON clients.salesloft_email_address IS NOT NULL 
      AND clients.id = clients_directus_users.clients_id AND clients_directus_users.directus_users_id = '${user.id}' 
      WHERE clients.active = true;`));
        const clients = clientsResult.rows;
        if (!user) {
            throw new Error('User not found');
        }
        if (!clients) {
            throw new Error('Clients not found');
        }
        const isAdmin = [
            'Admin',
            'SuperAdmin',
            'Manager',
            'SDR QA',
            'Web Team Member',
            'Campaign Strategist',
            'QA TL',
            'SDR Manager',
        ].includes(role.name);
        const url = makeUrl(user, isAdmin, dashboard, clients.map((c) => c.salesloft_email_address), 'http://localhost:3000');
        return res.json({ url });
    }
    catch (error) {
        console.log('error: ', error);
        throw new Error('Internal server error - Looker API error: ');
    }
};
function makeNonce(len) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
const makeUrl = (user, isAdmin, wantedDash, clientEmails, embed_domain) => {
    const host = 'looker.cienceapps.com';
    console.log('wanted=dashboard: ', wantedDash, dashMap[wantedDash]);
    const embed_path = '/login/embed/' +
        encodeURIComponent(`/embed/dashboards-next/${dashMap[wantedDash]}?theme=dark?embed_domain=${embed_domain || process.env.APP_URL}`);
    const nonce = JSON.stringify(makeNonce(16));
    const time = JSON.stringify(Math.floor(new Date().getTime() / 1000));
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
    const user_attributes = `{"email": "${user.email}", "view_all_clients": "${isAdmin ? 'yes' : 'no'}", "hide_navbar": "yes", "allowed_client_emails": ${JSON.stringify((clientEmails || []).join(',').replace(/"/g, ''))}}`;
    const access_filters = '{}';
    let string_to_sign = '';
    string_to_sign += host + '\n';
    string_to_sign += embed_path + '\n';
    string_to_sign += nonce + '\n';
    string_to_sign += time + '\n';
    string_to_sign += session_length + '\n';
    string_to_sign += external_user_id + '\n';
    string_to_sign += permissions + '\n';
    string_to_sign += models + '\n';
    string_to_sign += group_ids + '\n';
    string_to_sign += external_group_id + '\n';
    string_to_sign += user_attributes + '\n';
    string_to_sign += access_filters;
    const signature = crypto
        .createHmac('sha1', process.env.LOOKER_SSO_SECRET)
        .update(forceUnicodeEncoding(string_to_sign))
        .digest('base64')
        .trim();
    const query_params = {
        nonce: nonce,
        time: time,
        session_length: session_length,
        external_user_id: external_user_id,
        permissions: permissions,
        models: models,
        access_filters: access_filters,
        first_name: JSON.stringify(user.first_name),
        last_name: JSON.stringify(user.last_name),
        group_ids: group_ids,
        external_group_id: external_group_id,
        user_attributes: user_attributes,
        force_logout_login: true,
        signature: signature,
    };
    const query_string = querystring.stringify(query_params);
    return `https://` + host + embed_path + '?' + query_string;
};
//# sourceMappingURL=looker.controller.js.map