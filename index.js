import fs from 'fs' // 导入fs模块，用于读取文件
import express from 'express' // 导入express模块，用于创建web应用
import mammoth from 'mammoth' // 导入mammoth模块，用于将docx文件转换为html
import multer from 'multer';
import path from 'path'
const app = express() // 创建express应用


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })
app.get('/', async (req, res) => { // 当接收到GET请求时，执行以下操作
    const fileBuffer = fs.readFileSync('assets/word1.docx') // 读取assets目录下的word1.docx文件
    const result = await mammoth.extractRawText({ buffer: fileBuffer }) // 将文件转换为html
    res.send(result.value) // 将转换后的html发送给客户端
})


app.post('/upload', upload.single('file'), async (req, res) => {
    const fileBuffer = fs.readFileSync(req.file.path)
    const result = await mammoth.extractRawText({ buffer: fileBuffer }, {

    })
    res.send(result.value)
})
// 将静态资源托管到assets目录下
app.use('/assets', express.static('assets'))

app.use('/html', express.static('html')) // 将html目录下的静态资源作为静态服务器提供
app.listen(3000, () => { // 监听3000端口
  console.log('Example app listening on port 3000!') // 打印日志
})