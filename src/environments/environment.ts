export const environment = {
  production: false,
  redirectUrl: 'http://localhost:4200',
  msalConfig: {
    auth: {
      clientId: 'cded53bb-a939-4a05-aa5d-b29bd87756e9',
    },
  },
  apiConfig: {
    scopes: [],
    uri: '',
  },
  b2cPolicies: {
    names: {
      signUpSignIn: 'B2C_1_LoginSignUp',
      resetPassword: 'B2C_1A_PASSWORDRESET',
      editProfile: 'B2C_1A_PROFILEEDIT',
    },
    authorities: {
      signUpSignIn: {
        authority:
          'https://kallascorporation.b2clogin.com/kallascorporation.onmicrosoft.com/B2C_1_LoginSignUp',
      },
      resetPassword: {
        authority:
          'https://kallascorporation.b2clogin.com/kallascorporation.onmicrosoft.com/B2C_1A_PASSWORDRESET',
      },
      editProfile: {
        authority:
          'https://kallascorporation.b2clogin.com/kallascorporation.onmicrosoft.com/B2C_1A_PROFILEEDIT',
      },
    },
    authorityDomain: 'https://kallascorporation.b2clogin.com',
  },
};

// secret -> gLZ8Q~Xiutcd6chAmZhJ3Qn33zTxcbly7nJ2jag~
