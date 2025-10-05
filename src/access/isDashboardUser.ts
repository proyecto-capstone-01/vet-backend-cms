import { Access, FieldAccess } from 'payload';

// Return true or false based on if the user has the dashboard role
export const isDashboardUser: Access = ({ req: { user } }) => {
  return Boolean(user?.roles.includes('dashboard'));
}

// Return true or false based on if the user has an admin role
// export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
//   return Boolean(user?.roles?.includes('admin'));
// }
