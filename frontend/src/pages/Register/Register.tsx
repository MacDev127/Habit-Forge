import logo from '../../assets/images/logo.png';
import './Register.css';
import RegisterForm from '../../components/Register/RegisterForm';
const Register = () => {
  return (
    <div className="register-container">
      <div className="register-left">
        <img src={logo} alt="" />
      </div>

      <div className="register-right">
        <h2>Sign Up</h2>
        <p>Please enter your details to continue.</p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
