import {fastify} from "fastify";
import {prisma} from './lib/prisma';
import {getAllPromptsRoute} from "./routes/get-all-prompts";
import {uploadVideoRoute} from "./routes/upload-video";
import {createTranscriptionRoute} from "./routes/create-transcription";
import {generateAiCompletionRoute} from "./routes/generate-ai-completion";
import {fastifyCors} from "@fastify/cors";

const app = fastify()

app.register(fastifyCors, {
	origin: '*',
})

app.get('/', () => {
	return {
		"status": 200,
		"message": "Running!"
	}
})

app.register(getAllPromptsRoute)
app.register(uploadVideoRoute)
app.register(createTranscriptionRoute)
app.register(generateAiCompletionRoute)

app.listen({
	port: 3333
}).then(() => {
	console.log('HTTP Server Running!')
})