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

module.exports = {dummy, totalLikes, favoriteBlog}