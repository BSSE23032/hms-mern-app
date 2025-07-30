
import { Link } from "react-router-dom";
import SigninForm from "../components/SigninForm";
export default function SignIn() {
    return (

        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <SigninForm />
            <p className="mt-3">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
}
