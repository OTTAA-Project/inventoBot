declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly DISCORD_TOKEN: string;
			readonly MONGODB: string;
		}
	}
}

export {};