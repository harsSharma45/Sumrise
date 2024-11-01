import { Form } from "react-router-dom";
import './LoginPage.css'

export default function LoginPage(){
    return (
        <div className="container">
        <div className = "heading">
           <h4>Sign in with email</h4>
        </div>

        <div className="para">
            Enter the email and password associated with your account
        </div>
        <div className="input">
        <form action = "">
           <input type="text" placeholder="Username" class="input-field"/>
           <input type="password" placeholder="Password" class="input-field"/>
           <button>Login</button>

        </form>
        </div>
        </div>
    )
}