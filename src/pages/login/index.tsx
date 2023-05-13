import {
    Card,
    Typography,
    Form,
    Input,
    Button,
    Space,
    Col,
    Row,
    Select,
    notification
} from "antd"
import { UserOutlined, LockOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState } from "react";
const { Title } = Typography

import styles from "@/styles/loginCard.module.css"

export default function Login() {
    // UI States
    const [registerCardLeft, setRegisterCardLeft] = useState<string>("100%")
    const [loginCardHeight, setLoginCardHeight] = useState<string>("80vh")
    const [loginCardOverflow, setLoginCardOverflow] = useState<string>("hidden")
    const [btnLoading, setBtnLoading] = useState<boolean>(false)

    // Login States
    const [lLogin, setLLogin] = useState<string>()
    const [lPassword, setLPassword] = useState<string>()

    /* Register States*/
    const [rName, setRName] = useState<string>()
    const [rGender, setRGender] = useState<string>("male")
    const [rPosition, setRPosition] = useState<string>("visitor")
    const [rLogin, setRLogin] = useState<string>()
    const [rPassword, setRPassword] = useState<string>()
    const [rConfirmPassword, setRConfirmPassword] = useState<string>()

    type User = {
        fullname: string | undefined,
        gender: string | undefined,
        position: string | undefined,
        login: string | undefined,
        password: string | undefined,
        confirm_password: string | undefined
    }

    const ShowRegisterCard = () => {
        setLoginCardHeight("90vh")
        setLoginCardOverflow("scroll")

        setTimeout(() => {
            setRegisterCardLeft("0%")
        }, 600);
    }

    const HideRegisterCard = () => {
        setRegisterCardLeft("100%")

        setTimeout(() => {
            setLoginCardHeight("80vh")
            setLoginCardOverflow("hidden")

        }, 600);
    }

    const openNotification = (message: string, description: string, status: string) => {
        const bg_color = status === "success" ? "#e8ffee" : "#ffece8"

        notification.open({
            message: message,
            description: description,
            duration: 5,
            placement: "bottomLeft",
            icon: <ExclamationCircleOutlined />,
            style: {
                fontWeight: "bold",
                backgroundColor: bg_color
            }
        })
    }

    const Validate = (): boolean => {
        if (rPassword == rConfirmPassword) {
            return true
        } else {
            openNotification("FAIL", "The 'Password' and 'Confirm Password' fields must match.", "fail")
        }

        return false
    }

    const Register = async () => {
        if (Validate()) {
            setBtnLoading(true)

            const user: User = {
                fullname: rName,
                gender: rGender,
                position: rPosition,
                login: rLogin,
                password: rPassword,
                confirm_password: rConfirmPassword
            }

            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })

            const resJson = await res.json()
            openNotification(resJson.title, resJson.desc, resJson.status)

            setBtnLoading(false)
            HideRegisterCard()
        }
    }

    const Login = async () => {
        setBtnLoading(true)

        const loginGroup = {
            login: lLogin,
            password: lPassword
        }

        const res = await fetch("/api/user/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginGroup)
        })

        const resJson = await res.json()
        openNotification(resJson.title, resJson.desc, resJson.status)

        setBtnLoading(false)
    }

    return (
        <main className={ `${styles.main}` }>
            {/* Login Card */ }
            <Card className={ `${styles.loginCard}` } id="loginCard" style={ { height: loginCardHeight } }>
                <Title level={ 2 } className={ `${styles.title}` }>Login</Title>
                <Form
                    name="login_form"
                    autoComplete="off"
                    requiredMark={ false }
                    onFinish={ Login }>
                    <Space className={ `${styles.inputGroup}` } direction="vertical">

                        <Form.Item
                            name={ "l_login" }
                            labelCol={ { span: 24 } }
                            label="Login"
                            rules={ [{ required: true, message: "Please enter your login" }] }>
                            <Input size="large" placeholder="Login" prefix={ <UserOutlined /> }
                                onChange={ e => setLLogin(e.target.value) } />
                        </Form.Item>

                        <Form.Item
                            name={ "l_password" }
                            labelCol={ { span: 24 } }
                            label="Password"
                            rules={ [{ required: true, message: "Please enter your password" }] }>
                            <Input size="large" placeholder="Password" prefix={ <LockOutlined /> }
                                onChange={ e => setLPassword(e.target.value) } />
                        </Form.Item>

                        <Button className={ `${styles.submitBtn}` } type="primary" size="large" htmlType="submit" loading={ btnLoading }>LOGIN</Button>

                        <Button type="link" className={ `${styles.changeCardBtn}` } onClick={ ShowRegisterCard }>Dont have on account? Register now!</Button>
                    </Space>

                </Form>

                {/* Register Card */ }
                <Card className={ `${styles.registerCard}` } style={ { left: registerCardLeft, overflow: loginCardOverflow } }>
                    <Title level={ 2 } className={ `${styles.title}` }>Register</Title>
                    <Form
                        name="register_form"
                        autoComplete="off"
                        requiredMark={ false }
                        onFinish={ Register }>
                        <Space className={ `${styles.inputGroup}` } direction="vertical">

                            <Form.Item
                                name={ "r_fullname" }
                                labelCol={ { span: 24 } }
                                label="Fullname"
                                rules={ [{ required: true, message: "Please enter your full name" }] }>
                                <Input size="large" placeholder="Full Name" onChange={ e => setRName(e.target.value) } />
                            </Form.Item>

                            <Row gutter={ 10 }>
                                <Col flex={ "1 1 200px" }>
                                    <Form.Item
                                        name={ "r_gender" }
                                        initialValue={ "male" }
                                        labelCol={ { span: 24 } }
                                        label="Gender">
                                        <Select
                                            options={ [
                                                { label: "Male", value: "male" },
                                                { label: "Female", value: "female" },
                                                { label: "Other", value: "other" }
                                            ] }
                                            onSelect={ setRGender } />
                                    </Form.Item>
                                </Col>
                                <Col flex={ "1 1 200px" }>
                                    <Form.Item
                                        name={ "r_position" }
                                        initialValue={ "visitor" }
                                        labelCol={ { span: 24 } }
                                        label="Position">
                                        <Select
                                            options={ [
                                                { label: "Manager", value: "manager" },
                                                { label: "Employee", value: "employee" },
                                                { label: "Visitor", value: "visitor" }
                                            ] }
                                            onSelect={ setRPosition } />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name={ "r_login" }
                                labelCol={ { span: 24 } }
                                label="Login"
                                rules={ [{ required: true, message: "Create a login" }] }>
                                <Input size="large" placeholder="Login" onChange={ e => setRLogin(e.target.value) } />
                            </Form.Item>

                            <Form.Item
                                name={ "r_password" }
                                labelCol={ { span: 24 } }
                                label="Password"
                                rules={ [{ required: true, message: "Enter a password" }] }>
                                <Input.Password size="large" placeholder="Password" onChange={ e => setRPassword(e.target.value) } />
                            </Form.Item>

                            <Form.Item
                                name={ "r_confirm-password" }
                                labelCol={ { span: 24 } }
                                label="Confirm Password"
                                rules={ [{ required: true, message: "Confirm password" }] }>
                                <Input.Password size="large" placeholder="Confirm password" onChange={ e => setRConfirmPassword(e.target.value) } />
                            </Form.Item>

                            <Button className={ `${styles.submitBtn}` } type="primary" size="large" htmlType="submit" loading={ btnLoading }>REGISTER NOW!</Button>

                            <Button type="link" className={ `${styles.changeCardBtn}` } onClick={ HideRegisterCard }>Already have a account? Login now! </Button>
                        </Space>

                    </Form>
                </Card>

            </Card>
        </main>
    )
}
