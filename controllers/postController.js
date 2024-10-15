
const getAllPostsController = async (req, res) => {
    console.log(req._id);
    return res.status(200).send(`These are all the posts`);
}

module.exports = {
    getAllPostsController,
};