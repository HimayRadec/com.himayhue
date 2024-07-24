
/*
Created By: Himay 1/7/2024
Last Edit By: Himay 1/7/2024
Description: This file checks if the user is authenticated and redirects appropriately.
*/

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
   pages: {
      signIn: '/login',
   },
   callbacks: {
      authorized({ auth, request: { nextUrl } }) {
         const isLoggedIn = !!auth?.user;
         const path = nextUrl.pathname;

         // Paths that don't require authentication
         const authorizationPaths = ['/login', '/register'];

         if (isLoggedIn) {
            // Redirect to dashboard if user is already logged in and tries to access login or register page
            if (authorizationPaths.includes(path)) {
               return Response.redirect(new URL('/dashboard', nextUrl));
            }

            // Allow access to all other pages if user is logged in
            return true;
         }

         // Allow access to authorization paths
         if (authorizationPaths.includes(path)) {
            return true;
         }

         // Redirect to login page if user is not logged in and tries to access any protected page
         return Response.redirect(new URL('/login', nextUrl));
      },
   },
   providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
