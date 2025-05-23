import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createConfirmedDummyUsers() {
	const dummyUsers = [
		{
			email: "bruce_wayne@example.com",
			password: "GothamKnight001!",
			user_metadata: {
				username: "batman",
				avatar_url: "https://ui-avatars.com/api/?name=Batman&background=random",
				phone: "+1 555-000-0001",
			},
		},
		{
			email: "clark_kent@example.com",
			password: "ManOfSteel2024!",
			user_metadata: {
				username: "superman",
				avatar_url:
					"https://ui-avatars.com/api/?name=Superman&background=random",
				phone: "+1 555-000-0002",
			},
		},
		{
			email: "tony_stark@example.com",
			password: "IronManRules123!",
			user_metadata: {
				username: "ironman",
				avatar_url:
					"https://ui-avatars.com/api/?name=Iron+Man&background=random",
				phone: "+1 555-000-0003",
			},
		},
		{
			email: "darth_vader@example.com",
			password: "DarkSideForce777!",
			user_metadata: {
				username: "darth_vader",
				avatar_url:
					"https://ui-avatars.com/api/?name=Darth+Vader&background=random",
				phone: "+1 555-000-0004",
			},
		},
		{
			email: "bruce_banner@example.com",
			password: "HulkSmash999!",
			user_metadata: {
				username: "hulk",
				avatar_url: "https://ui-avatars.com/api/?name=Hulk&background=random",
				phone: "+1 555-000-0005",
			},
		},
		{
			email: "bane@example.com",
			password: "VenomBoost888!",
			user_metadata: {
				username: "bane",
				avatar_url: "https://ui-avatars.com/api/?name=Bane&background=random",
				phone: "+1 555-000-0006",
			},
		},
		{
			email: "thanos@example.com",
			password: "InfinityGauntlet123!",
			user_metadata: {
				username: "thanos",
				avatar_url: "https://ui-avatars.com/api/?name=Thanos&background=random",
				phone: "+1 555-000-0007",
			},
		},
		{
			email: "norman_osborn@example.com",
			password: "GreenGoblinChaos!",
			user_metadata: {
				username: "green_goblin",
				avatar_url:
					"https://ui-avatars.com/api/?name=Green+Goblin&background=random",
				phone: "+1 555-000-0008",
			},
		},
	];

	console.log("Starting to create dummy users...");

	for (const user of dummyUsers) {
		try {
			const { data, error } = await supabaseAdmin.auth.admin.createUser({
				email: user.email,
				password: user.password,
				user_metadata: user.user_metadata,
				email_confirm: true,
			});

			if (error) {
				console.error(`Error creating user ${user.email}:`, error);
			} else {
				console.log(`Created user ${user.email} (ID: ${data.user.id})`);
			}
		} catch (e) {
			console.error(`Exception creating user ${user.email}:`, e);
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	console.log("All dummy users created.");
}

createConfirmedDummyUsers();
