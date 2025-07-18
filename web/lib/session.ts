import 'server-only'

import { User } from '@/db/schema'
import { cache } from 'react'

export const getUser = cache(async (): Promise<User> => {
  return { id: 1 }
  // const desktopSessionUser = await getDesktopSessionUser();
  // if (desktopSessionUser) {
  // 	return desktopSessionUser;
  // }
  // const clerkSessionUser = await getClerkSessionUser();
  // if (!clerkSessionUser) {
  // 	warn('No Clerk session found');
  // }
  // At this point, if we
  // if (!clerkSessionUser) {
  // 	warn('No sessions found. Will throw 401');
  // 	unauthorized();
  // }
  // return clerkSessionUser;
})
