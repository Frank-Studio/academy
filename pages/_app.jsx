import '/styles/style.scss'
import RouteHandler from '/components/RouteHandler'
import { AuthProvider } from "/context/AuthContext"
import Header from '/components/Header'

function MyApp({ Component, pageProps }) {
    return (
        <>
            <AuthProvider>
                <Header />
                <RouteHandler>
                    <Component {...pageProps }/>

                    <div className="p-8 border-t text-right" data-footer>
                        @Frank Studio Academy
                    </div>
                </RouteHandler>
            </AuthProvider>
         </>
    )
}

export default MyApp