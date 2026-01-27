const { MusicianMedia, Musician } = require("../models")

exports.create = async (req, res) => {    
    try{

        const musician = await Musician.findOne({
            where:{ user_id: req.user.id}
        })

        if(!musician){
            return res.status(404).json({
                error: "Musician Profile not Found"
            })
        }

        const media = await MusicianMedia.create({
            musician_id: musician.id,
            type: req.body.type,
            title: req.body.title,
            url: req.body.url
        })
        const { musician_id, ...mediaData } = media.toJSON();
        return res.status(201).json(media)
    }catch(error){
        res.status(500).json({ error: " Internal Error", details: error.message })
    }
}