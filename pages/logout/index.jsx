import {useContext, useEffect} from 'react'
import AuthContext from "/context/AuthContext";
import {NEXT_URL} from '/config'

export default function Logout(){
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        makeLogout().then((json) => {
            logout()
        })
    }, [])

    const makeLogout = async () => {
        const res = await fetch(`${NEXT_URL}api/revoke`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: user.token
            })
          })
      
          const json = await res.json()
          return true;
    }
}