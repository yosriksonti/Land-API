const app = require('./functions/index.js')
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port 3000')
})
module.exports = app