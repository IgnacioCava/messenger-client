'use client'
import { signIn, signOut } from "next-auth/react"

const SingInGoogleButton = () => {
    return( 
        <button onClick={() => signIn('google')}>
            Sign in
        </button>
    )
}

const SingOutButton = () => {
    return( 
        <button onClick={() => signOut()}>
            Sign out
        </button>
    )
}

export {
    SingInGoogleButton,
    SingOutButton
}