export const environment = {
  production: true,
  redirectUrl:'https://bluebellplatform.azurewebsites.net',
  msalConfig: {
      auth: {
          clientId: 'f41870ef-c846-44b6-9bd0-ba579c6cca57',
      }
  },
  apiConfig: {
      scopes: ["https://bbindex.onmicrosoft.com/f41870ef-c846-44b6-9bd0-ba579c6cca57/QueryToken"],
      uri: 'https://bluebellplatform-bff.azurewebsites.net'
  },
  b2cPolicies: {
    names: {
        signUpSignIn: "B2C_1A_SIGNUP_SIGNIN",
        resetPassword: "B2C_1A_PASSWORDRESET",
        editProfile: "B2C_1A_PROFILEEDIT"
    },
    authorities: {
        signUpSignIn: {
            authority: 'https://bbindex.b2clogin.com/bbindex.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN'
        },
        resetPassword: {
            authority: 'https://bbindex.b2clogin.com/bbindex.onmicrosoft.com/B2C_1A_PASSWORDRESET'
        },
        editProfile: {
            authority: "https://bbindex.b2clogin.com/bbindex.onmicrosoft.com/B2C_1A_PROFILEEDIT"
        }
      },
      authorityDomain: "https://bbindex.b2clogin.com"
  },
};