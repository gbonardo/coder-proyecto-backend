import { Router } from "express";
//import { userModel } from "../dao/models/users.models.js";
import { getUsers, getUserById, putUserById, deleteUser } from "../controllers/users.controller.js";
import crypto from 'crypto'
import { sendRecoveryMail } from "../config/nodemailer.js";


const userRouter = Router()
const recoveryLinks = {}

userRouter.get('/', getUsers)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', putUserById)
userRouter.delete('/:id', deleteUser)

//Envio de mail
userRouter.post('/password-recovery', (req, res) => {
    const { email } = req.body

    try {
        const token = crypto.ranbomBytes(20).toString('hex')

        recoveryLinks[token] = { email: email, timestamp: Date.now() }

        const recoveryLink = `http://localhost:8080/api/users/reset-password/${token}`

        sendRecoveryMail(email, recoveryLink)

        res.status(200).send('Correo de recuperacion enviado')

    } catch (error) {
        res.status(500).send(`Error al enviar el mail: ${error}`)
    }
})
//Recuperar contraseña
userRouter.post('/reset-password/:token', (req, res) => {
    const { token } = req.params
    const { newPassword, newPassword2 } = req.body

    try {
        const linkData = recoveryLinks[token]
        if (linkData && Date.now() - linkData.timestamp <= 3600000) {
            console.log(newPassword, newPassword2)
            const { email } = linkData
            console.log(email)
            console.log(token)
            if (newPassword == newPassword2) {

                delete recoveryLinks[token]

                res.status(200).send('Contraseña modificada correctamente')
            } else {
                res.status(400).send('Las contraseñas deben ser identicas')
            }
        } else {
            res.status(400).send('Token invalido o expirado, intente nuevamente.')
        }
    } catch (error) {
        res.status(500).send(`Error al modificar contraseña ${error}`)
    }
})


export default userRouter