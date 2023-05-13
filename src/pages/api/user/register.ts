import { NextApiRequest, NextApiResponse } from "next"
import { ref, set, get, child } from "firebase/database"
import { database } from "@/services/firebase"
import { fail } from "assert"

type UserType = {
    fullname: string | undefined,
    gender: string | undefined,
    position: string | undefined,
    login: string | undefined,
    password: string | undefined,
    confirm_password: string | undefined,
}

export default function Register(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { fullname, gender, position, login, password, confirm_password } = req.body
        const user: UserType = {
            fullname: fullname,
            gender: gender,
            position: position,
            login: login,
            password: password,
            confirm_password: confirm_password
        }

        set(ref(database, "users/" + user.login), {
            fullname: user.fullname,
            gender: user.gender,
            position: user.position,
            password: user.password,
        })

        res.send({
            title: "REGISTERED",
            desc: "Congratulations!! You have been successfully registered.",
            status: "success"
        })
    }
}