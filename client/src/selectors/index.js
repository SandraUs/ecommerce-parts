import { ROLE } from '../constants';

export const selectUser = (state) => state.user;

export const selectUserRole = (state) => state.user?.roleId ?? ROLE.GUEST;
