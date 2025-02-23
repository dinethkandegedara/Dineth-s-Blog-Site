const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Routes
router.get("/", (req, res) => {
  const postsFile = "./data/posts.json";
  let posts = [];
  if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  }
  res.render("index", { posts });
});

router.get("/new-post", (req, res) => {
  res.render("new-post");
});

router.post("/add-post", upload.single("featureImage"), (req, res) => {
  const postsFile = "./data/posts.json";
  let posts = [];
  if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  }

  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    slug: slugify(req.body.title),
    content: req.body.content,
    featureImage: req.file ? `/uploads/${req.file.filename}` : null,
    date: new Date().toISOString().split("T")[0],
  };

  posts.push(newPost);
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf-8");
  res.redirect("/");
});

router.get("/post/:slug", (req, res) => {
  const postsFile = "./data/posts.json";
  const posts = fs.existsSync(postsFile) ? JSON.parse(fs.readFileSync(postsFile, "utf-8")) : [];
  const post = posts.find(p => p.slug === req.params.slug);
  res.render("post", { post });
});

// Delete post route
router.post("/delete-post/:id", (req, res) => {
  const postsFile = "./data/posts.json";
  let posts = [];

  if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  }

  // Remove the post with the specified ID
  posts = posts.filter(post => post.id !== parseInt(req.params.id));

  // Save updated posts back to the JSON file
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf-8");

  res.redirect("/");
});
router.get("/edit-post/:id", (req, res) => {
  const postsFile = "./data/posts.json";
  let posts = [];
  
  if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  }
  
  const post = posts.find(p => p.id === parseInt(req.params.id));
  res.render("edit-post", { post });
});

// Update post route
router.post("/update-post/:id", upload.single("featureImage"), (req, res) => {
  const postsFile = "./data/posts.json";
  let posts = [];

  if (fs.existsSync(postsFile)) {
    posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
  }

  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (postIndex > -1) {
    const updatedPost = {
      ...posts[postIndex],
      title: req.body.title,
      content: req.body.content,
      featureImage: req.file ? `/uploads/${req.file.filename}` : posts[postIndex].featureImage,
    };
    
    posts[postIndex] = updatedPost;
    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2), "utf-8");
  }

  res.redirect("/");
});
module.exports = router;
