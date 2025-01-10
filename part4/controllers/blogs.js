const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.post('/:id/comments', async (request, response) => {
  const { id } = request.params;
  const { content } = request.body;

  const blog = await Blog.findById(id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  const comment = new Comment({
    content,
    blog: blog._id,
  });

  try {
    const savedComment = await comment.save();
    blog.comments = blog.comments.concat(savedComment._id);  // Link the comment to the blog
    await blog.save();

    response.status(201).json(savedComment);
  } catch (error) {
    response.status(400).json({ error: 'Failed to save comment' });
  }
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // Fetch any user
  //const user = await User.findOne({})

  // Fetch the token from the request
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { name: 1 }).populate('comments');;
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter