import type { Access } from 'payload'

// Allow only server-trusted access
export const isServer: Access = ({ req }) => {
  // Allow calls made via Payload's local API (same process)
  console.log('Checking isServer access for request with payloadAPI:', req?.payloadAPI);
  return req?.payloadAPI === 'local';

  // Allow when a trusted internal token header matches env
  // const header = req?.headers?.get('x-internal-token')
  // const token = Array.isArray(header) ? header[0] : header
  // return !!(token && process.env.INTERNAL_SUBMIT_TOKEN && token === process.env.INTERNAL_SUBMIT_TOKEN);
}

// same as isServer but allow passing roles to deny access unless there's a higher role. e.g. if someone has 'blogger' but also admin
export const isServerOrRoles = (allowedRoles: string[]): Access => {
  return ({ req }) => {
    const isServerRequest = req?.payloadAPI === 'local';
    console.log('Checking isServerOrRoles access, isServerRequest:', isServerRequest, req?.payloadAPI);
    if (!isServerRequest) return false;

    const userRoles = req?.user?.roles || [];
    console.log('Checking isServerOrRoles access for request with roles:', userRoles);

    return userRoles.some((role) => allowedRoles.includes(role))
  }
}

// TODO: direct api call doesn't work with isServerOrRoles because req.payloadAPI is REST