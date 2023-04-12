import {db} from './db/conn.mjs'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import bodyParser from 'body-parser'
import multer from 'multer'

const app = express()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = './images';
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json())
app.use(
    express.urlencoded(),
    cors({
        origin: 'http://localhost:3000'
    })
)

app.post('/api/createUser', async (req, res) => {
    const data = req.body
    const collection = db.collection("Users")
    let result = await collection.insertOne(data);
    res.send(result).status(204);
})
app.post('/api/login', async (req, res) => {
    const data = req.body
    const collection = db.collection("Users")
    let result = await collection.findOne({"username": data.login, "password": data.password})
    res.send(result).status(200)
})
app.post('/api/sendPost', upload.single('file'),  async (req, res) => {
    console.log(req.file)
    let dir = `./images/${req.body.login}/`
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    let oldPath = `./images/${req.file.originalname}`
    let newPath = `./images/${req.body.login}/${req.file.originalname}`
    fs.rename(oldPath, newPath, function (err) {
        if (err) throw err
        console.log('Successfully Moved File')
    })

    let data = {
        login: req.body.login,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        dateCreate: Date('now'),
        description: req.body.description
    }
    const collection = db.collection("Posts")
    let result = await collection.insertOne(data)
    res.status(200).json(req.file)
})


app.get('/api/getPosts', async (req, res) => {
    const collection = db.collection("Posts")
    let results = await collection.find({}).toArray()
    let promises = results.map(async (el) => {
        const filename = `images/${el.login}/${el.filename}`
        const row = await fs.promises.readFile(filename)
        return row
    })
    let mas = await Promise.all(promises)
    res.send(mas)
})

app.listen(8000, () => {console.log("Connected! port: 34561")})