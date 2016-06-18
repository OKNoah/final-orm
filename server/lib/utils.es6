import gm from 'gm'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import crypto from 'crypto'
import rmdir from 'rmdir'
import config from '../config'


export default class Utils {


	static _save(filepath, stream) {
		return new Promise(function (resolve, reject) {
			if (!stream) throw Error `2 argument isnt stream`

			mkdirp(path.dirname(filepath), function (error) {
				if (error) reject(error)
				let writeStream = fs.createWriteStream(filepath)
				stream.pipe(writeStream)
				stream.on('end', resolve)
				stream.on('error', reject)
				writeStream.on('error', reject)
			})
		})
	}


	static async removeDir(dirpath) {
		return new Promise(function (resolve, reject) {
			if (!dirpath) return resolve()
			rmdir(dirpath, function () {
				resolve()
			})
		})
	}


	static createRandomString(length = 64) {
		return crypto.randomBytes(length).toString('hex')
	}


	static async saveFile(stream, ext) {
		if (!stream) throw Error `1 argument isnt stream`

		let storagePath = config.storage
		let folderName = this.createRandomString(64)
		let fileName = this.createRandomString(5) + `.${ext}`
		let filePath = path.join(storagePath, folderName, fileName)
		let fileUrl = `${folderName}/${fileName}`
		await this._save(filePath, stream)
		return fileUrl
	}


	static async remove(fileUrl) {
		if (!fileUrl) return
		let storagePath = config.storage
		let dirPath = path.join(storagePath, path.parse(fileUrl).dir)
		await this.removeDir(dirPath)
	}


	static resizeImage(stream, ext, width = 1024, height = 1024){
		return gm(stream, `img.${ext}`).resize(width, height, '!').stream()
	}


	static async saveImage(stream, ext, width = 1024, height = 1024) {
		let gmStream = this.resizeImage(stream, ext, width, height)
		return await this.saveFile(gmStream, ext)
	}


}


