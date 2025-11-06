import { Access, FieldAccess } from 'payload';

// Return true or false based on if the user has the dashboard role or higher (admin)
export const isDashboardUser: Access = ({ req: { user } }) => {
  return Boolean(user?.roles.includes('dashboard') || user?.roles.includes('admin'));
}

// Return true or false based on if the user has the dashboard role or higher (admin) for field-level access
export const isDashboardUserFieldLevel: FieldAccess = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('dashboard') || user?.roles?.includes('admin'));
}
