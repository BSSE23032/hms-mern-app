import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";
export default function SignUp() {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <SignupForm />
            <p className="mt-3">
                Already have an account? <Link to="/signin">Sign In</Link>
            </p>
        </div>
    );
}
