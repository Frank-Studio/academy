import { AUTH_URL } from "/config/index"

const Api =  async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    const get = await fetch(`${AUTH_URL}&email=${email}&password=${password}`,{
        method: 'POST'
    })

    const json = await get.json()

    if(json.success){ 
        res.status(200).json({ json });
    } else {
        res.status(403).json({ json:{success: false}, message: "Error generic" });
    }
}

export default Api