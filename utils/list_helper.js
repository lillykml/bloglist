const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((accumulator, currentvalue) => {
        return accumulator + currentvalue.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    let favorite = {}
    let maxLikes = 0

    if (blogs.length === 0) return favorite
    else {blogs.forEach(element => {
        if (element.likes >= maxLikes) {
            maxLikes = element.likes
            favorite = element
        }
    })
    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }}
}

const mostBlogs = (blogs) => {
    let authors = {}
    if (blogs.length === 0) return {}
    else {
        blogs.forEach(
            element => {
                if (element.author in authors) {
                    authors[element.author] += 1
                } else {authors[element.author] = 1}

            }
        )
    }

    let maxAuthor = '';
    let maxCount = 0;
    for (const author in authors) {
        if (authors[author] >= maxCount) {
            maxCount = authors[author];
            maxAuthor = author;
        }
    }
    return { author: maxAuthor, blogs: maxCount };
}

const mostLikes = (blogs) => {
    let authors = {}
    if (blogs.length === 0) return {}
    else {
        blogs.forEach(
            element => {
                if (element.author in authors) {
                    authors[element.author] += element.likes
                } else {authors[element.author] = element.likes}

            }
        )
    }

    let maxAuthor = '';
    let maxLikes = 0;
    for (const author in authors) {
        if (authors[author] >= maxLikes) {
            maxLikes = authors[author];
            maxAuthor = author;
        }
    }
    return { author: maxAuthor, likes: maxLikes }
}

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes}