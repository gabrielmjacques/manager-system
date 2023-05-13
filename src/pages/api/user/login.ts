import { NextApiRequest, NextApiResponse } from "next"
import { ref, set, get, child } from "firebase/database"
import { database } from "@/services/firebase"

type userType = {
    fullname: string | undefined,
    gender: string | undefined,
    position: string | undefined,
    login: string | undefined,
    password: string | undefined
}

export default function User(req: NextApiRequest, res: NextApiResponse)
{
    if (req.method === "POST")
    {
        const { login, password } = req.body

        get(child(ref(database), `users/${login}`)).then((snapshot) =>
        {
            const user = snapshot.val()

            if (snapshot.exists() && password == user.password)
            {
                res.send({ title: "LOGGED", desc: "You have been successfully logged in.", status: "success" })

            } else
            {
                res.send({ title: "FAIL", desc: "Incorrect username or password", status: "fail" })
            }
        }).catch((error) =>
        {
            console.log("Error: ", error)
        })
    }
}