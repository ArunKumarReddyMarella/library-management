const apiV1 = require("express")()
const { router: bookRouter } = require("./book")
const { router: userRouter } = require("./users")
// const { router: chatRouter } = require("./chat")

apiV1.use("/book", bookRouter)
apiV1.use("/user", userRouter)
// apiV1.use("/chat", chatRouter)

module.exports = { apiV1 }
