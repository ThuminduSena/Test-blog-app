import express from 'express';
import { createAd, deleteAd, getAds, publishAd, updateAd } from '../controllers/ad.controller.js';
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post('/create', verifyToken, createAd);
router.get('/getads', getAds);
router.delete('/deleteAd/:adId', verifyToken ,deleteAd);
router.put('/updateAd/:adId', verifyToken, updateAd);
router.get('/publish', publishAd);

export default router;