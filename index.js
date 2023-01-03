const express = require("express")
const fs = require("fs")
const path = require("path")
const cors = require("cors")

const app = express()

app.use(cors({ origin: "*" }))

app.get("/", (req, res) => {
  const { query } = req
  const isSearch = query.keyword ? true : false
  const isLimit = query.limit ? true : false
  const regex = isSearch && new RegExp(`${query.keyword}`, "ig")
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "db.json"), "utf-8")
  )
  const posts = isSearch
    ? data.filter(
        post => regex.test(post.description) || regex.test(post.title)
      )
    : data

  res
    .status(200)
    .json(
      isLimit
        ? posts
            .sort(() => 0.5 - Math.random())
            .slice(
              0,
              Number(query.limit) > 1000 || query.limit === "limit"
                ? 1000
                : query.limit
            )
        : posts.sort(() => 0.5 - Math.random()).slice(100)
    )
})

app.listen(process.env.PORT || 5000, error => {
  if (error) console.log(error)

  console.log("Server started")
})
