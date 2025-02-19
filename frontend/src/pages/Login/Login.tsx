import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { Button, Container, Typography } from '@mui/material';
import LoginForm from '../../components/Login/LoginForm';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import './Login.css';
const Login = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  return (
    <>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          alignItems: 'center',
          marginTop: '50px',
        }}
      >
        <h1>login</h1>

        <LoginForm>
          <div className="btn-wrapper">
            <Button
              startIcon={<GoogleIcon />}
              size="small"
              variant="contained"
              color="primary"
              onClick={auth.loginWithGoogle}
              style={{ marginBottom: '10px', padding: '16px', width: '96%' }}
            >
              Sign in with Google
            </Button>
            <Button
              startIcon={<GitHubIcon />}
              size="small"
              variant="contained"
              onClick={auth.loginWithGitHub}
              style={{
                margin: '10px',
                backgroundColor: 'black',
                padding: '16px',
                width: '95%',
              }}
            >
              Sign in with GitHub
            </Button>
          </div>
        </LoginForm>
      </Container>
    </>
  );
};

export default Login;
