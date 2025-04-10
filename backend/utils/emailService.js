import nodemailer from "nodemailer";



  const sendEmail=(emailAdress,subject,text)=>{

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'jabezsolomonz@gmail.com',
          pass: 'hcff mipp qeai cfti'
        }
      });
    const mailOptions = {
        from: `jabezsolomonz@gmail.com`,
        to: `${emailAdress}`,
        subject:`${subject}`,
        text:`${text}`,
      };
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
 }

 export default sendEmail;