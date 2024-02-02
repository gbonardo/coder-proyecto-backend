import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'gastonbonardod@gmail.com',
        pass: 'augb vibd reto qwqj',
        authMethod: 'LOGIN'
    }
})

export const sendRecoveryMail = (email, recoveryLink) => {
    const mailOptions = {
        from: 'gastonbonardod@gmail.com',
        to: email,
        subject: 'Link para restablecer su contraseña',
        text: `Haga clic en el siguiente enlace para restablecer su contraseña: ${recoveryLink}`

    }

    transport.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error)
        } else {
            console.log('Email enviado correctamente.')
        }
            
    } )
}