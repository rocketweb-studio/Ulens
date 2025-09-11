export const Path = {
  Main: '/',
  Profile: '/profile',
  UserProfile: (userId: string | number) => `/profile/${userId}`,
  UserCreate: (userId: string | number) => `/profile/${userId}?action=create`,
  Settings: '/settings',
  SignIn: '/sign-in',
  SignUp: '/sign-up',
  TermOfService: '/sign-up/term-of-service',
  PrivacyPolicy: '/sign-up/privacy-policy',
  Logout: '/logout',
  SignUpConfirmedEmail: '/sign-up/confirmed-email',
  PasswordRecovery: '/password-recovery',
  ResetPassword: '/account/reset-password',
  InDevelopment: '/in-development',

} as const