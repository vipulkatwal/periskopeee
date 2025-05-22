import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Initialize Supabase client with admin privileges
const supabaseAdmin = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createConfirmedDummyUsers() {
	// Array of dummy users with data
	const dummyUsers = [
		{
			email: "lily_evans@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "lily_evans",
				avatar_url:
					"https://ui-avatars.com/api/?name=Lily+Evans&background=random",
				phone: "+1 555-987-1001",
			},
		},
		{
			email: "harry_potter@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "harry_potter",
				avatar_url:
					"https://ui-avatars.com/api/?name=Harry+Potter&background=random",
				phone: "+1 555-987-1002",
			},
		},
		{
			email: "hermione_granger@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "hermione_granger",
				avatar_url:
					"https://ui-avatars.com/api/?name=Hermione+Granger&background=random",
				phone: "+1 555-987-1003",
			},
		},
		{
			email: "ron_weasley@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "ron_weasley",
				avatar_url:
					"https://ui-avatars.com/api/?name=Ron+Weasley&background=random",
				phone: "+1 555-987-1004",
			},
		},
		{
			email: "ginny_weasley@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "ginny_weasley",
				avatar_url:
					"https://ui-avatars.com/api/?name=Ginny+Weasley&background=random",
				phone: "+1 555-987-1005",
			},
		},
		{
			email: "luna_lovegood@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "luna_lovegood",
				avatar_url:
					"https://ui-avatars.com/api/?name=Luna+Lovegood&background=random",
				phone: "+1 555-987-1006",
			},
		},
		{
			email: "neville_longbottom@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "neville_longbottom",
				avatar_url:
					"https://ui-avatars.com/api/?name=Neville+Longbottom&background=random",
				phone: "+1 555-987-1007",
			},
		},
		{
			email: "draco_malfoy@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "draco_malfoy",
				avatar_url:
					"https://ui-avatars.com/api/?name=Draco+Malfoy&background=random",
				phone: "+1 555-987-1008",
			},
		},
		{
			email: "cho_chang@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "cho_chang",
				avatar_url:
					"https://ui-avatars.com/api/?name=Cho+Chang&background=random",
				phone: "+1 555-987-1009",
			},
		},
		{
			email: "cedric_diggory@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "cedric_diggory",
				avatar_url:
					"https://ui-avatars.com/api/?name=Cedric+Diggory&background=random",
				phone: "+1 555-987-1010",
			},
		},
		{
			email: "sirius_black@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "sirius_black",
				avatar_url:
					"https://ui-avatars.com/api/?name=Sirius+Black&background=random",
				phone: "+1 555-987-1011",
			},
		},
		{
			email: "remus_lupin@example.com",
			password: "SecurePass123!",
			user_metadata: {
				username: "remus_lupin",
				avatar_url:
					"https://ui-avatars.com/api/?name=Remus+Lupin&background=random",
				phone: "+1 555-987-1012",
			},
		},
	];

	console.log("Starting to create dummy users...");

	for (const user of dummyUsers) {
		try {
			// Create user with email confirmation bypassed
			const { data, error } = await supabaseAdmin.auth.admin.createUser({
				email: user.email,
				password: user.password,
				user_metadata: user.user_metadata,
				email_confirm: true,
			});

			if (error) {
				console.error(`Error creating user ${user.email}:`, error);
			} else {
				console.log(
					`Successfully created user ${user.email} with ID ${data.user.id}`
				);
			}
		} catch (e) {
			console.error(`Exception while creating user ${user.email}:`, e);
		}
		// Add delay between user creations to prevent rate limiting
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	console.log("Finished creating dummy users");
}

createConfirmedDummyUsers();
