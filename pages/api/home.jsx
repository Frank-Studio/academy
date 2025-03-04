import { API_URL } from "../../config/index"

const Api = async(req, res) => {

    const get = await fetch(`${API_URL}academy/home`)
    const json = await get.json()


    if(json.status){ 
        res.status(200).json({ json });
    } else {
        res.status(403).json({ json });
    }

}

export default Api