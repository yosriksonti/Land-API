const  express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const functions = require('firebase-functions')

const {
  postUser,
  findUser,
  putUser,
  putPassword,
  authUser,
  postReset,
  getUsers
} = require('./users/controllers/index.js')
const {
  deleteAnnounce,
  postAnnounce,
  findAnnounce,
  getAnnounces,
  putAnnounce,
  putVisibAnnounce,
  searchAnnounces,
  getUserAnnounces,
}= require("./announces/controllers/index.js")
const {
  postAdmin,
  findAdmin,
  getAdmins,
  deleteAdmin,
  authAdmin
}= require("./admins/controllers/index.js")

const makeCallback = require('./config/express-callback/index.js')

dotenv.config()
/**************** ENV api root **************
//const apiRoot = process.env.DM_API_ROOT
*/

/**************** Static api root ***********/
const apiRoot = "/api"
const app = express()
app.options('*',cors())
app.use(bodyParser.json())
// TODO: figure out DNT compliance.
app.use((_, res, next) => {
  res.set({ Tk: '!' })
  next()
})




app.post(`${apiRoot}/users/add`, makeCallback(postUser))
app.put(`${apiRoot}/users/update`, makeCallback(putUser))
app.put(`${apiRoot}/users/update/password`, makeCallback(putPassword))
app.get(`${apiRoot}/users/:id`, makeCallback(findUser))
app.get(`${apiRoot}/users/`, makeCallback(getUsers))

app.post(`${apiRoot}/users/login`, makeCallback(authUser))
app.post(`${apiRoot}/users/reset`, makeCallback(postReset))

app.post(`${apiRoot}/announces/add`, makeCallback(postAnnounce))
app.put(`${apiRoot}/announces/`, makeCallback(deleteAnnounce))
app.get(`${apiRoot}/announces/:id`, makeCallback(findAnnounce))
app.get(`${apiRoot}/announces/user/:userId`, makeCallback(getUserAnnounces))
app.get(`${apiRoot}/announces/`, makeCallback(getAnnounces))

app.get(`${apiRoot}/announces/search/find`, makeCallback(searchAnnounces))
app.put(`${apiRoot}/announces/put`, makeCallback(putAnnounce))
app.put(`${apiRoot}/announces/put/visib`, makeCallback(putVisibAnnounce))

app.post(`${apiRoot}/admins/add`, makeCallback(postAdmin))
app.get(`${apiRoot}/admins/:id`, makeCallback(findAdmin))
app.get(`${apiRoot}/admins/`, makeCallback(getAdmins))
app.put(`${apiRoot}/admins/delete`, makeCallback(deleteAdmin))
app.post(`${apiRoot}/admins/login`, makeCallback(authAdmin))

 console.log(new Date(1607105109453).toISOString())
  // listen for requests
  app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port 3000')
  })
module.exports  = app
