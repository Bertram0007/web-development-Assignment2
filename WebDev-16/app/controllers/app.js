const express = require("express")
const app = express()
//读取文件的模块，读取json文件
const fs = require("fs");
//用来解决跨域问题，ip和端口保持一致是同源，不同源是跨域
const cors = require("cors")
//解决express的post，比如req.body就是拿到post的参数
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const { v4: uuidv4 } = require('uuid');
const md5 = require('md5');

let mdb = require("./Mongo");
const {ObjectID, ObjectId} = require("bson");
const {sendRegisterEmail, sendResetPwd} = require("./email/email");
let db

(async () => {
    db = await mdb("Phone")
    verify(db, 'phonelist', '../models/phonelisting.json')
    verify(db, 'userlist', '../models/userlist.json')
})()

function verify(db, colName, filePath) {
    db.listCollections({ name: colName }).next(function (err, collinfo) {
        if (collinfo) {
            console.log(`${colName} collection exists`);
        } else {
            importDB(db, colName, filePath)
        }
    });
}

function importDB(db, colName, filePath) {
    db.createCollection(colName, function (err, res) {
        if (err) throw err;
        var fileContent = fs.readFileSync(filePath);
        if (fileContent) {
            var tbfile = JSON.parse(fileContent);
            for (const i of tbfile) {
                if(colName === 'phonelist'){
                    i.image = `${i.brand}.jpeg`
                }
                // 确保json存在_id字段且对象内含有'$oid'字段
                if (i._id) {
                    i._id = ObjectID(i._id['$oid'])
                }
            }
            db.collection(colName).insertMany(tbfile, function (err, res) {
                if (err) throw err;
                console.log(`${colName} has been imported`);
            })
        }
    })
}

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Methods", "PUT", "POST", "GET", "DELETE", "OPTIONS")
    res.header("Content-Type", "application/json;charet=utf-8")
    next()
})

app.use(cors())


/**
 * @description userlist表
 * @param { username,password } 用户名，密码
 * @abstract 600(查询失败) 601(创建失败) 602(更新失败) 603(删除失败) 604(操作失败)
 * @returns
 */
app.post('/login', (req, res) => {
    let inuser = req.body.email
    let inpwd = md5(req.body.password)
    db.collection('userlist').find({ "email": inuser }).toArray((err, doc) => {
        if (err) {
            res.send({ code: 600, data: doc, message: err.message })
        } else {
            if (doc.length) {
                if (doc[0].verify_key !== undefined && doc[0].verify_key !== null) {
                    res.send({ code: 604, data: doc, message: 'click the link and activate it!' })
                } else if (doc[0].password === inpwd) {
                    const rule = {
                        email: inuser
                    }
                    res.send({ code: 200, data: doc, message: 'success' })
                } else {
                    res.send({ code: 604, data: doc, message: 'password is wrong!' })
                }
            } else {
                res.send({ code: 604, data: doc, message: 'username is wrong!' })
            }
        }
    })
})

app.post('/register', (req, res) => {
    let inuser = req.body.email
    req.body.password = md5(req.body.password)
    let first_name = req.body.firstname
    let last_name = req.body.lastname

    db.collection('userlist').find({ "email": inuser }).toArray((err, doc) => {
        if (err) {
            res.send({ code: 600, data: doc, message: err.message })
        } else {
            // console.log(doc[0].verify_key)
            // console.log('User exists + ', doc)
            if (doc.length > 0 && (doc[0].verify_key === undefined || doc[0].verify_key === null)) {
                res.send({ code: 601, message: 'User already register!' });
            } else if (doc.length > 0 && (doc[0].verify_key !== undefined && doc[0].verify_key !== null)) {
                res.send({ code: 601, message: 'User has not click link!' });
            } else {
                // 发送邮件，进行注册验证
                // 1. 生成邮箱校验码
                // 2. 发送一个 get 形式的，包含用户唯一id， email, verify_key的邮件。
                // 形如http://localhost:3000/regiter_success?email=2221@qq.com&verify_key=e408c17f-ec26-4847-a633-c39cd6621f49
                // 3. 点击该链接，相当于发起get请求。
                const key = uuidv4();

                sendRegisterEmail({ email: inuser, verify_key: key })
                let insertObj = {
                    email: inuser,
                    password: req.body.password,
                    firstname: first_name,
                    lastname: last_name,
                    verify_key: key
                }
                db.collection('userlist').insertOne(insertObj, (err, doc) => {
                    if (err) {
                        res.send({ code: 601, data: doc, message: err.message })
                    } else {
                        if (doc.length > 0) {
                            res.send({ code: 200, data: doc, message: 'success' })
                        }
                        res.send({ code: 600, data: doc, message: 'first register, email has been sent' })
                    }
                })
            }
        }
    })
})

app.post('/resetpwd', (req, res) => {
    let inuser = req.body.email
    db.collection('userlist').find({ "email": inuser }).toArray((err, doc) => {
        if (err) {
            res.send({ code: 600, data: doc, message: err.message })
        } else {
            if (doc.length > 0 && (doc[0].verify_key === undefined || doc[0].verify_key === null)) {
                sendResetPwd({ email: req.body.email })
                res.send({ code: 200, message: 'reset email sent' })
            } else {
                res.send({ code: 600, message: 'invalid email' })
            }
        }
    })
})
// 修改密码部分，向user界面发出一个302重定向请求，期望user前端界面识别302代码，对重定向部分不做登录校验，直接使用对应email进行登录
// res.data 数据结构如下：
// {
//     _id: new ObjectId("627e650e2ca78132e4dd383c"),
//         email: '1525126020@qq.com',
//     password: 'e10adc3949ba59abbe56e057f20f883e',
//     firstname: 'mingcheng',
//     lastname: 'yu',
//     verify_key: null,
//     code: 302
// }

app.get('/toresetpwd', (req, res) => {
    const {email: email} = req.query;
    //console.log(email, verify_key)
    db.collection('userlist').find({"email": email}).toArray((err, doc) => {
        if (err) {
            res.send({code: 600, data: doc, message: err.message})
        } else {
            if (doc) {
                res.data = doc[0]
                res.data.code = 302
                res.redirect('http://localhost:8080/#/user')

                console.log(res.data)
                console.log(res.data.code)
                console.log("after redirect")
            } else {
                res.send({code: 600, data: doc, message: 'unexpected error'})
            }
        }
    })
});

app.get('/regiter_success', (req, res) => {
    const {email: email, verify_key} = req.query;
    //console.log(email, verify_key)
    db.collection('userlist').find({"email": email}).toArray((err, doc) => {
        if (err) {
            res.send({code: 600, data: doc, message: err.message})
        } else {
            if (doc.length > 0) {
                if (doc[0].verify_key === verify_key) {
                    db.collection('userlist').updateOne({"email": email}, {$set: {"verify_key": null}})
                }
            }
        }
    })
    res.send({code: 200, message: 'success register!'})
});


//Review
app.post('/makeReview', (req, res) => {
    let insertObj = {
        reviewer: req.body.reviewer,
        rating: req.body.rating,
        comment: req.body.comment
    }
    // console.log(req.body)
    // console.log(insertObj)
    let phoneId = new ObjectId(req.body.id)
    db.collection('phonelist').findOne({_id: phoneId}, function (err, doc) {
        if (err) {
            res.send({code: 602, data: doc, message: err.message})
        }
        if (doc) {
            doc.reviews.push(insertObj)
            let myquery = {"_id": phoneId};
            let newvalues = {$set: {"reviews": doc.reviews, "_id": phoneId}};
            db.collection('phonelist').updateOne(myquery, newvalues, (err, doc) => {
                if (err) {
                    res.send({code: 602, data: doc, message: err.message})
                } else {
                    res.send({code: 200, data: doc, message: "Review success"})
                }
            })
        } else {
            res.send({code: 602, data: doc, message: "No such phone"})
        }
    })

})


app.post('/user/update/:id', (req, res) => {
    db.collection('userlist').updateOne({ _id: req.params.id }, { $set: req.body }, (err, doc) => {
        if (err) {
            res.send({ code: 602, data: doc, message: err.message })
        } else {
            res.send({ code: 200, data: doc, message: 'success' })
        }
    })
})


app.post('/user/verify/:password', (req, res) => {
    db.collection('userlist').find(req.body).toArray((err, doc) => {
        if (err) {
            res.send({ code: 604, data: doc, message: err.message })
        } else {
            if (doc[0].password === md5(req.params.password)) {
                res.send({ code: 200, data: doc, message: 'success' })
            } else {
                res.send({ code: 600, data: [], message: 'password incorrect！' })
            }
        }
    })
})

app.post('/user/change', (req, res) => {
    const { email, oldPassword, newPassword, firstName, lastName } = req.body
    db.collection('userlist').find({ email }).toArray((err, doc) => {
        if (err) {
            res.send({ code: 604, data: doc, message: err.message })
        } else {
            if (doc[0].password === md5(oldPassword)) {
                db.collection('userlist').updateOne({ email }, {
                    $set: {
                        password: md5(newPassword),
                        firstName,
                        lastName
                    }
                }, (err2, doc2) => {
                    if (err2) {
                        res.send({ code: 604, data: doc2, message: err2.message })
                    } else {
                        res.send({ code: 200, data: doc2, message: 'user info has been changed!' })
                    }
                })
            } else {
                res.send({ code: 600, data: [], message: 'password incorrect！' })
            }
        }
    })
})

app.get('/userlist', (req, res) => {
    db.collection('userlist').find({}).toArray((err, doc) => {
        if (!err) {
            res.send(doc)
        }
    })
})

app.post('/getName', (req, res) => {
    let userId = new ObjectId(req.body.id)
    // console.log(userId)
    // _id: userId
    db.collection('userlist').findOne({_id: userId}, function (err, doc) {
        // console.log(doc)
        if (err) {
            res.send({code: 602, data: doc, message: err.message})
        }
        if (doc) {
            let firstName = doc.firstname
            let lastName = doc.lastname
            let userName = firstName + " " + lastName
            res.send({code: 200, data: userName, message: "success"})
        } else {
            res.send({code: 602, data: doc, message: "No such user"})
        }
    })
})



app.post('/user/updatepsd', (req, res) => {
    const { email, newPassword } = req.body
    db.collection('userlist').updateOne({ "email": email }, { $set: { "password": md5(newPassword) } }, (err, doc) => {
        if (err) {
            res.send({ code: 602, data: [], message: 'update failed' })
        } else {
            res.send({ code: 200, data: doc, message: 'success' })
        }
    })
})

/**
 * @description phonelist
 * @abstract 600(查询失败) 601(创建失败) 602(更新失败) 603(删除失败) 604(操作失败)
 * @returns
 */

app.get('/phonelist', async (req, res) => {
    const { title, brand, highPrice, lowPrice } = req.query
    const options = {}
    if (title) options.title = new RegExp(title, 'i');
    if (brand) options.brand = brand
    if (highPrice && lowPrice) options.price = { $gte: Number(lowPrice), $lte: Number(highPrice) }
    try {
        const phonelist = await db.collection('phonelist').find(options).toArray()
        if (phonelist.length) {
            for (const phone of phonelist) {
                if (phone.reviews&&phone.reviews.length) {
                    for (const review of phone.reviews) {
                        const user = await db.collection('userlist').findOne({ _id: ObjectID(review.reviewer) })
                        review.reviewer = user ? `${user.firstname} ${user.lastname}` : '未知用户'
                    }
                }
            }
            res.send({ code: 200, data: phonelist, message: 'success' })
        } else {
            res.send({ code: 200, data: [], message: 'success' })
        }
    } catch (error) {
        console.log(error);
        res.send({ code: 600, data: [], message: 'find failed' })
    }
})

app.post('/phonelist/add', (req, res) => {
    db.collection('phonelist').insertOne(req.body, (err, doc) => {
        if (err) {
            res.send({ code: 601, data: doc, message: err.message })
        } else {
            res.send({ code: 200, data: doc, message: 'new phone info has been added' })
        }
    })
})

app.post('/phonelist/delete/:id', (req, res) => {
    db.collection('phonelist').deleteOne({ _id: ObjectID(req.params.id) }, (err, doc) => {
        if (err) {
            res.send({ code: 603, data: doc, message: 'delete failed' })
        } else {
            res.send({ code: 200, data: doc, message: 'delete success' })
        }
    })
})

app.get('/phonelist/distinct', (req, res) => {
    db.collection('phonelist').distinct('brand', {}, (err, doc) => {
        if (err) {
            res.send({ code: 600, data: doc, message: 'find failed' })
        } else {
            res.send({ code: 200, data: doc, message: 'find success' })
        }
    })
})

app.listen(3000, () => {
    console.log("server starting at port:3000");
})






