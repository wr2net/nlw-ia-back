import {FastifyInstance} from "fastify";
import {fastifyMultipart} from "@fastify/multipart";
// @ts-ignore
import path from "node:path";
import {randomUUID} from "node:crypto";
// @ts-ignore
import fs from "node:fs";
import {pipeline} from "node:stream";
import {prisma} from "../lib/prisma";
import {promisify} from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
	app.register(fastifyMultipart, {
		limits: {
			fileSize: 1_048_576 * 25,
		}
	})
	app.post('/video', async (request, replay) => {
		const data = await request.file()

		if (!data) {
			return replay.status(400).send({error: "Missing file input."})
		}
		const extension = path.extname(data.filename)

		if (extension !== '.mp3') {
			return replay.status(400).send({error: "Invalid input type. Please, upload a MP3 file."})
		}

		const fileBaseName = path.basename(data.filename, extension)
		const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
		const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

		await pump(data.file, fs.createWriteStream(uploadDestination))

		const video = await prisma.video.create({
			data: {
				name: data.filename,
				path: uploadDestination,
			}
		})

		return {
			video,
		}
	})
}
