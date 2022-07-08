//node cli_google_drive_uploader.js

const fs = require('fs')
const {google} = require('googleapis')
const shortUrl = require("node-url-shortener");
const inquirer = require('inquirer');

const KEYPATH = 'lambda-355312-59546969c76d.json'
const SCOPES = ['https://www.googleapis.com/auth/drive']
const auth = new google.auth.GoogleAuth({
    keyFile: KEYPATH,
    scopes: SCOPES
})

async function upload(auth, path, name, shorten)
{
    let extension = await path.split('\\').slice(-1)[0].split('.').slice(-1)[0]

    const driveService = google.drive({version: 'v3', auth});

    let fileMetaData = {
        'name': `${name}.${extension}`,
        'parents': ['1Y3C2dazXVlDjg3qfc_xqYAQRYQXUcLB9']
    }

    let media = {
        mimeType: `image/${extension}`,
        body: fs.createReadStream(path)
    }

    let response = await driveService.files.create({
        resource: fileMetaData,
        media: media
    })

    let id = await response.data.id
    let photoLink = `https://drive.google.com/file/d/${id}/view`
    if (shorten){
        shortUrl.short(photoLink, function (err, url) {
            console.log(url);
        });
    }
    else{
        console.log(photoLink)
    }
}

async function main(){
    let path = await inquirer.prompt([
            {
                name: "path",
                type: "input",
                message: "Enter path to the file you want to send:\n",
            }
        ])
    path = path.path
    let rename = await inquirer.prompt([
        {
            name: "response1",
            type: "confirm",
            message: "Do you want to change the original name?",
        }])
    rename = rename.response1
    let filename
    if (rename) {
        filename = await inquirer.prompt([
            {
                name: "filename",
                type: "input",
                message: "Enter the name:\n",
            }
        ])
        filename = filename.filename
    }
    else {
        filename = await path.split('\\').slice(-1)[0].split('.').slice(-1)[1]
    }
    let shorten = await inquirer.prompt([
            {
                name: "response2",
                type: "confirm",
                message: "Do you want to shorten the link?",
            }])
    shorten = shorten.response2
    upload(auth, path, filename, shorten)
}
main()
// upload(auth, 'C:\\Users\\АААААААААААААААААААА\\Pictures\\cat.png', 'wow', true)