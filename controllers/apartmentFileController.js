const apartmentFileRepository = require("../repo/apartmentFileRepository");

class ApartmentFileController {
    getAllSync(req, res, next) {
        try {
            const apartments = apartmentFileRepository.getAllSync();
            return res.status(200).json(apartments);
        } catch (error) {
            return next(error);
        }
    }

    getAll(req, res, next) {
        apartmentFileRepository.getAll((error, apartments) => {
            if (error) {
                return next(error);
            }

            return res.status(200).json(apartments);
        });
    }

    async getAllAsync(req, res, next) {
        try {
            const apartments = await apartmentFileRepository.getAllAsync();
            return res.status(200).json(apartments);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = new ApartmentFileController();