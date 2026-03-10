const fs = require("fs");
const path = require("path");

class ApartmentFileRepository {
    constructor() {
        const filePathFromEnv = process.env.APARTMENTS_FILE_PATH;

        if (!filePathFromEnv) {
            throw new Error("APARTMENTS_FILE_PATH is not defined in environment");
        }

        this.filePath = path.resolve(process.cwd(), filePathFromEnv);
    }

    getAllSync() {
        const content = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(content);
    }

    getAll(callback) {
        fs.readFile(this.filePath, "utf-8", (error, data) => {
            if (error) {
                return callback(error);
            }

            try {
                const apartments = JSON.parse(data);
                return callback(null, apartments);
            } catch (parseError) {
                return callback(parseError);
            }
        });
    }

    async getAllAsync() {
        const data = await fs.promises.readFile(this.filePath, "utf-8");
        return JSON.parse(data);
    }
}

module.exports = new ApartmentFileRepository();