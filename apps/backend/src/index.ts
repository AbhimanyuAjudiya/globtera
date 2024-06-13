import express from 'express';

const app = express()

app.get('/', (req, res) => {
    return res.json({
        msg: "hello"
    })
})

app.listen(3002)