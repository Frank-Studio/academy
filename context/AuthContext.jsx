import { createContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { NEXT_URL } from "../config"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const router = useRouter()

  useEffect(() => {
    checkUserLoggedIn().then((data) => {
      setUser(data)
      setTimeout(() =>{
        authCheck(false, data)
      },200)
     
      setTimeout(() =>{
        setLoaded(true)
      }, 500)
    })

    router.events.on('routeChangeComplete', authCheck)
    return () => {
        router.events.off('routeChangeComplete', authCheck)
    }
  }, [router])

 

  const authCheck = (route, data) => {
    const _user = (!route) ? data : user
    const publicPages = ['/', '/recupera-password']

    if(!_user){
        if(!publicPages.includes(router.asPath)){
            window.location = '/'
            return
        }
    } else {
        if(router.asPath == '/recupera-password'){
            window.location = '/'
            return
        }
    }
  }
  

  const checkUserLoggedIn = async (user) => {
    if(localStorage.getItem('token')){
      const res = await fetch(`${NEXT_URL}api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem('token')
        })
      })
      const data = await res.json()
      if(data.json.success){
        return data.json.data.user
      }
    } 
    
    return false
  }

  const login = async ({ email, password }) => {
    alert(NEXT_URL)
    const res = await fetch(`${NEXT_URL}api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      })
    })

    const data = await res.json() 
    if(data.json.success){
      if(!data.json.data.user.dismiss){
        localStorage.setItem('token', data.json.data.jwt)
        setUser(data.json.data.user)
        setLoaded(false)
      } else {
        data.json.success = false
      }
    }
    
    return data;

  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  const refreshToken = async () => {
    const res = await fetch(`${NEXT_URL}api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem('token')
      })
    })
    const data = await res.json()

    if(user){
      setUser(data.json.data.user)
    }
    if(!data.json.success && user){
      window.location = '/'
    }
  }

  if(loaded){
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    )
  } 

  return (
    <div className="loading">
     
    </div>
  )
}

export default AuthContext