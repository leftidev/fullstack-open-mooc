const dummy = (blogs) => {
    const array = blogs
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((n, {likes}) => n + likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const mostLikedBlog = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)

    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}