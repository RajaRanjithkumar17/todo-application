import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Button, Input } from "antd";

import initialValues from "./helper/initialValues";
import validationSchema from "./helper/validationSchema";
import { triggerNotification } from "../../components/toaster/ToastBar";

import "./Login.css"
import { setAuthentication } from "../../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface formData {
    [key: string]: string;
}
  
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_APP_BASE_URL

    const handleSubmit = async (values: formData, { setSubmitting }: any) => {
        try {
        const response = await axios.get(`${baseUrl}/auth`);
        const { username, password } = response.data;
        
        if (values.username === username && values.password === password) {

            dispatch(
                setAuthentication(
                    { ...response.data, isLogin:true }
                ),
            );
            localStorage.setItem("auth","true")
            navigate('/')
            triggerNotification("success", "", "Login successful!", "topRight");

        } else {
            triggerNotification("error", "", "Invalid username or password" , "topRight");

        }
        } catch (error) {
            triggerNotification("error", "", "Error while fetching data" , "topRight");

        }
        setSubmitting(false);
    };

    return (
        <div className="flex h-full items-center justify-center">
        <div className = "login-container p-5  max-w-[400px] mx-0 mx-auto" >
        <h2 className="text-[24px] text-center bold pb-10">Login</h2>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
            <Form>
                <div className="formGroup">
                <div className="relative mb-8">
                <label htmlFor="username" className="block text-left ">Username</label>
                <Field className = "text-[16px]" as={Input}  type="text" name="username" placeholder="Enter username" />
                <ErrorMessage className="error-message"  name="username" component="div" />
                </div>

                <div className="relative mb-8">
                <label htmlFor="password" className="block text-left">Password</label>
                <Field as={Input} className = "text-[16px]"   type="password" name="password" placeholder="Enter password" />
                <ErrorMessage className="error-message"  name="password" component="div" />
                </div>
                </div>
                <Button type="primary" disabled={isSubmitting} className="login-btn w-full" htmlType="submit">
                {isSubmitting ? "Logging in..." : "Login"}
                </Button>
            </Form>
            )}
        </Formik>
        </div>
        </div>
    );
};

export default Login;
