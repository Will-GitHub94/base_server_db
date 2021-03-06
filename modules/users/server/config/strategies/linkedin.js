

/**
 * Module dependencies
 */
import passport from "passport";
import passportLinkedIn from "passport-linkedin";
import users from "../../controllers/users.server.controller";

const LinkedInStrategy = passportLinkedIn.Strategy;

export default (config) => {
	// Use linkedin strategy
	passport.use(new LinkedInStrategy(
		{
			consumerKey: config.linkedin.clientID,
			consumerSecret: config.linkedin.clientSecret,
			callbackURL: config.linkedin.callbackURL,
			passReqToCallback: true,
			profileFields: [
				"id",
				"first-name",
				"last-name",
				"email-address",
				"picture-url",
			],
			scope: [
				"r_basicprofile",
				"r_emailaddress",
			],
		},
		(req, accessToken, refreshToken, profile, done) => {
		// Set the provider data and include tokens
			const providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			const providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				profileImageURL: (providerData.pictureUrl) ? providerData.pictureUrl : undefined,
				provider: "linkedin",
				providerIdentifierField: "id",
				providerData: providerData,
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		},
	));
};
