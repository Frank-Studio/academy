import { API_URL } from "/config/index"

const Api = async(req, res) => {
    const get = await fetch(`${API_URL}academy/setComplete/?token=${req.body.token}&user_id=${req.body.user_id}&id=${req.body.id}&set=${req.body.set}`)
    const json = await get.json()

    if(json.status){ 
        res.status(200).json({ json });
    } else {
        res.status(403).json({ json: {success: false, message: "Error generic"} });
    }
};

export default Api