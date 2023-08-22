import { SetMetadata } from '@nestjs/common';

export const SKIP_ADMIN_ROLES_KEY = 'skipAdminRoles';

export const SkipAdminRoles = () => SetMetadata(SKIP_ADMIN_ROLES_KEY, true);
