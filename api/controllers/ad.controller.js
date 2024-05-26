import { errorHandler } from "../utils/error.js";
import Ad from '../models/ad.model.js';

export const createAd = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not autorized to create advertisements'));
    }
    if(!req.body.title || !req.body.content || !req.body.targetURL || !req.body.startDate || ! req.body.endDate){
        return next(errorHandler(400, 'Please provide all required fields.'));
    }

    const newAd = new Ad (req.body);
    try {
        const savedAd = await newAd.save();
        res.status(201).json(savedAd);
    } catch (error) {
        next(error);
    }
}

export const getAds = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const ads = await Ad.find({
            ...(req.query.adId && {_id: req.query.adId }),
            ...(req.query.title && {title: req.query.title }),
            ...(req.query.content && {content: req.query.content }),
            ...(req.query.image && {image: req.query.image }),
            ...(req.query.viewCount && {viewCount: req.query.viewCount }),
            ...(req.query.endDate && {endDate: req.query.endDate }),
            ...(req.query.startDate && {startDate: req.query.startDate }),

            }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

            const totalAds = await Ad.countDocuments();
            const now = new Date();
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );
            const nonExpiredAds = await Ad.countDocuments({
                endDate: { $gte: today},
            });

            res.status(200).json({
                ads,
                totalAds,
                nonExpiredAds,
            });
        } catch (error) {
        next(error);
    }
}
export  const deleteAd = async (req, res, next) => {
    try {
        const ad = await Ad.findById(req.params.adId);
        console.log(ad);
        if(!ad){
            return next(errorHandler(404,'Ad not found'));
        }
        if(!req.user.isAdmin){
            return next(errorHandler(403,'You re not allowed to delete this Ad'));
        }
        await Ad.findByIdAndDelete(req.params.adId);
        res.status(200).json('Ad has been deleted');
    } catch (error) {
        next(error);
    }
}
export const updateAd = async (req, res, next ) => {
    if (!req.user.isAdmin){
        return next(errorHandler(403, 'You re not allowed to update this post'));
    }
    try {
        const updatedAd = await Ad.findByIdAndUpdate(req.params.adId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                image: req.body.image,
                targetURL: req.body.targetURL,
            }},{new: true}
        );
        res.status(200).json(updatedAd);
    } catch (error) {
        next(error);
    }
}
export const publishAd = async (req, res, next) => {
    try {
        const currentDate = new Date();
        const limit = parseInt(req.query.limit) || 1;
        const ads = await Ad.find({
            endDate: { $gte: currentDate},
            startDate: { $lte: currentDate }
        })
        .sort({viewCount: 1})
        .limit(limit);

        const incrementedAds = await Promise.all(ads.map(async (ad) => {
            ad.viewCount += 1;
            await ad.save();
            return ad;
        }))

        res.status(200).json(incrementedAds);
    } catch (error) {
        next(error)
    }
}