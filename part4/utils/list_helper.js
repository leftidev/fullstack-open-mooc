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

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const authorBlogCount = blogs.reduce((total, blog) => {
        total[blog.author] = (total[blog.author] || 0) + 1
        return total
    }, {})

    let topAuthor = null;
    let maxBlogs = 0;

    for (const author in authorBlogCount) {
        if (authorBlogCount[author] > maxBlogs) {
            topAuthor = author;
            maxBlogs = authorBlogCount[author];
        }
    }

    return {
        author: topAuthor,
        blogs: maxBlogs
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const authorLikesCount = blogs.reduce((total, blog) => {
        total[blog.author] = (total[blog.author] || 0) + blog.likes;
        return total;
    }, {});

    let topAuthor = null;
    let maxLikes = 0;

    for (const author in authorLikesCount) {
        if (authorLikesCount[author] > maxLikes) {
            topAuthor = author;
            maxLikes = authorLikesCount[author];
        }
    }

    return {
        author: topAuthor,
        likes: maxLikes
    };
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}