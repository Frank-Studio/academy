import { AUTH_URL } from "../../config/index"

const Api = async(req, res) => {

    const get = await fetch(`${AUTH_URL}refresh&JWT=${req.body.token}`,{
        method: 'POST'
    })
    const json = await get.json()

    if(json.success){ 
        json.data.user.token = req.body.token
        res.status(200).json({ json });
    } else {
        res.status(403).json({ json: {success: false, message: "Error generic"} });
    }
}

export default Api